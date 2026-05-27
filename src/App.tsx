import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import VideoForm from './components/VideoForm';
import VideoCard from './components/VideoCard';
import EditModal from './components/EditModal';
import { Project, FilterType } from './types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User 
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { AlertCircle, SlidersHorizontal, Save, LogIn, LogOut, Lock } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saveStatus, setSaveStatus] = useState('Real-time database active');
  const [isLoading, setIsLoading] = useState(true);

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Sync with Firestore projects collection in real-time when authenticated!
  useEffect(() => {
    if (!currentUser) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    
    const unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        const list: Project[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          list.push({
            id: docSnapshot.id,
            name: data.name || '',
            type: data.type || '',
            date: data.date || '',
            amount: Number(data.amount) || 0,
            notes: data.notes || '',
            paid: Boolean(data.paid),
            createdAt: data.createdAt || '',
          });
        });
        setProjects(list);
        setIsLoading(false);
        setSaveStatus(`✓ Database Synced at ${new Date().toLocaleTimeString()}`);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'projects');
        setIsLoading(false);
      }
    );

    return () => unsubscribeSnapshot();
  }, [currentUser]);

  // Auth Operations
  const handleLogIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Sign In failed:', err);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign Out failed:', err);
    }
  };

  // DB Operations: CREATE (Add log)
  const handleAddProject = async (newProjectFields: Omit<Project, 'id' | 'paid' | 'createdAt'>) => {
    if (!currentUser) return;
    const docId = String(Date.now());
    const path = `projects/${docId}`;
    
    // Construct exactly as defined in the hardwired rules schema
    const newProject: Project = {
      id: docId,
      name: newProjectFields.name,
      type: newProjectFields.type,
      date: newProjectFields.date,
      amount: newProjectFields.amount,
      notes: newProjectFields.notes || '', // enforce non-null string format matching rules
      paid: false,
      createdAt: new Date().toISOString(),
    };

    try {
      // Opt-in strict optimistic saving directly on cloud storage
      await setDoc(doc(db, 'projects', docId), newProject);
      setSaveStatus(`✓ Log saved successfully at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // DB Operations: UPDATE (Toggle paid checkbox state)
  const handleTogglePaid = async (id: string) => {
    if (!currentUser) return;
    const path = `projects/${id}`;
    const targetProject = projects.find((p) => p.id === id);
    if (!targetProject) return;

    try {
      await updateDoc(doc(db, 'projects', id), {
        paid: !targetProject.paid,
      });
      setSaveStatus(`✓ Log status updated`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // DB Operations: DELETE (Remove entry)
  const handleDeleteProject = async (id: string) => {
    if (!currentUser) return;
    const path = `projects/${id}`;
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    if (window.confirm(`Delete "${target.name}"?\nThis cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        setSaveStatus(`✓ Log successfully deleted`);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  // DB Operations: UPDATE (Modal form editor)
  const handleSaveEdit = async (id: string, updatedFields: Partial<Project>) => {
    if (!currentUser) return;
    const path = `projects/${id}`;

    try {
      await updateDoc(doc(db, 'projects', id), {
        name: updatedFields.name,
        type: updatedFields.type,
        date: updatedFields.date,
        amount: updatedFields.amount,
        notes: updatedFields.notes || '',
      });
      setSaveStatus(`✓ Saved changes at ${new Date().toLocaleTimeString()}`);
      setEditingProject(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Computed views filtering
  const filteredProjects = projects.filter((p) => {
    if (filter === 'paid') return p.paid;
    if (filter === 'unpaid') return !p.paid;
    return true;
  });

  const totalOwed = projects
    .filter((p) => !p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  // Sorting numbering (oldest project is Video #1)
  const reversedProjects = [...projects].reverse();

  // 1. Loader Gate while assessing auth initial state
  if (authChecking) {
    return (
      <div className="min-h-screen bg-bg text-text-main flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto"></div>
          <p className="text-xs text-muted">Checking secure registration state...</p>
        </div>
      </div>
    );
  }

  // 2. Beautiful Slate Black Secure Portal if unauthenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-bg text-text-main flex items-center justify-center p-4 sm:p-6 font-mono pattern-grid">
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-300 relative">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-sans font-extrabold tracking-tight uppercase text-text-main">
              Peptonix Ad Videos — Work Log
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Shared freelancer work-log and payment ledger between Creator{' '}
              <span className="text-accent font-medium">Sahand Najmaden</span> & Client{' '}
              <span className="text-accent2 font-medium">Karbin Yasin</span>.
            </p>
          </div>

          <div className="bg-card/50 border border-border rounded-lg p-4 text-left space-y-2 text-xs text-muted leading-relaxed select-none">
            <div className="flex items-center gap-1.5 text-[10px] text-accent font-bold uppercase tracking-wider">
              <span>Why login?</span>
            </div>
            <span>
              By migrating data storage to Firestore cloud syncing, logging an entry updates both partners in real-time, resolving any desync issues across desktops or phones.
            </span>
          </div>

          <button
            onClick={handleLogIn}
            type="button"
            className="w-full py-3 bg-accent text-[#0d0d0d] rounded-xl font-sans font-extrabold tracking-wide uppercase hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl shadow-accent/10"
          >
            <LogIn className="w-4 h-4" /> Entry with Google Account
          </button>
        </div>
      </div>
    );
  }

  // 3. Main Dashboard if authenticated
  return (
    <div className="min-h-screen bg-bg text-text-main font-mono p-4 sm:p-6 pb-20 select-text">
      
      {/* Top Banner Context containing User ID log status */}
      <div className="max-w-[860px] mx-auto mb-4 flex justify-between items-center bg-surface/40 border border-border/60 rounded-xl px-4 py-2 text-[10px] text-muted">
        <div className="flex items-center gap-1.5 truncate pr-4">
          <div className="h-1.5 w-1.5 rounded-full bg-success"></div>
          <span className="truncate">SignedIn as: <strong className="text-text-main font-semibold">{currentUser.email}</strong></span>
        </div>
        <button
          onClick={handleLogOut}
          className="flex items-center gap-1 hover:text-danger cursor-pointer active:scale-95 transition text-muted"
        >
          <LogOut className="w-3.5 h-3.5" /> SignOut
        </button>
      </div>

      <Header />

      <main className="space-y-6">
        {/* KPI Stats section */}
        <StatsRow projects={projects} />

        {/* Create Form */}
        <VideoForm onAddProject={handleAddProject} />

        {/* History & Filters List */}
        <section className="max-w-[860px] mx-auto">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3 pb-2 border-b border-border/40">
            <h3 className="font-sans font-extrabold text-sm tracking-widest uppercase flex items-center gap-1.5 text-text-main">
              <SlidersHorizontal className="w-4 h-4 text-accent" /> Video History
            </h3>
            
            <div className="flex gap-1.5 bg-surface/50 p-1 border border-border rounded-xl">
              {(['all', 'unpaid', 'paid'] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-[11px] uppercase font-semibold cursor-pointer transition ${
                    filter === tab
                      ? 'bg-accent text-[#0d0d0d] font-bold shadow'
                      : 'text-muted hover:text-text-main hover:bg-card'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-muted font-mono tracking-wide text-xs">
              Loading work logs...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-surface/30">
              <AlertCircle className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted">
                No videos logged yet.
                <br />
                Add your first completed ad video above to begin tracking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => {
                const indexNum = reversedProjects.findIndex((x) => x.id === project.id) + 1;
                const isCreator = currentUser?.email === 'shexsahand88@gmail.com';
                return (
                  <VideoCard
                    key={project.id}
                    project={project}
                    indexNumber={indexNum}
                    isCreator={isCreator}
                    onEdit={(p) => setEditingProject(p)}
                    onTogglePaid={handleTogglePaid}
                    onDelete={handleDeleteProject}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Karbin's Total Balance Due Bar */}
        <div className="max-w-[860px] mx-auto bg-surface border-2 border-border/85 rounded-xl p-5 flex justify-between items-center flex-wrap gap-3 shadow-lg shadow-danger/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-danger rounded-full" />
            <div>
              <span className="text-[10px] text-muted tracking-widest uppercase font-mono block">
                Outstanding Balance
              </span>
              <h4 className="font-sans font-extrabold text-sm tracking-wider uppercase text-text-main flex items-center gap-1">
                💰 Total Karbin Owes Sahand
              </h4>
            </div>
          </div>
          <div className="font-sans font-extrabold text-2xl text-danger">
            {totalOwed.toLocaleString('en-US')} IQD
          </div>
        </div>

        {/* Sync Saved Status */}
        <div className="max-w-[860px] mx-auto text-center flex items-center justify-center gap-1.5 text-[10px] text-muted font-mono select-none">
          <Save className="w-3.5 h-3.5 text-muted opacity-60" />
          <span>{saveStatus}</span>
        </div>
      </main>

      {/* Editing popup Modal portal */}
      <EditModal
        project={editingProject}
        onSave={handleSaveEdit}
        onClose={() => setEditingProject(null)}
      />
    </div>
  );
}
