import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../../types/course';
import { FileText, X, Save, Trash2 } from 'lucide-react';

interface NotesPanelProps {
  lessonId: string;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const NotesPanel = ({ lessonId, isOpen, onClose, userId }: NotesPanelProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen, lessonId]);

  const loadNotes = async () => {
    // In real app, this would fetch from backend
    // For now, load from localStorage
    const savedNotes = localStorage.getItem(`notes-${userId}-${lessonId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  const saveNotes = (notesToSave: Note[]) => {
    localStorage.setItem(`notes-${userId}-${lessonId}`, JSON.stringify(notesToSave));
  };

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    setLoading(true);
    const newNote: Note = {
      id: editingNoteId || `note-${Date.now()}`,
      lessonId,
      content: currentNote,
      createdAt: editingNoteId
        ? notes.find(n => n.id === editingNoteId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedNotes: Note[];
    if (editingNoteId) {
      updatedNotes = notes.map(n => (n.id === editingNoteId ? newNote : n));
    } else {
      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setCurrentNote('');
    setEditingNoteId(null);
    setLoading(false);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note.content);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleNewNote = () => {
    setCurrentNote('');
    setEditingNoteId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:static right-0 top-0 h-full w-full lg:w-96 bg-gray-900 border-l border-gray-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-ecco" />
                <h3 className="font-bold text-lg">Notes</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 text-sm">No notes yet</p>
                  <p className="text-gray-500 text-xs mt-1">Add your first note below</p>
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="text-gray-400 hover:text-green-ecco transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Note Editor */}
            <div className="p-4 border-t border-gray-800 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">
                  {editingNoteId ? 'Edit Note' : 'New Note'}
                </h4>
                {editingNoteId && (
                  <button
                    onClick={handleNewNote}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    New
                  </button>
                )}
              </div>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Write your note here..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco resize-none min-h-24 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim() || loading}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold
                    transition-colors
                    ${
                      !currentNote.trim() || loading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-green-ecco text-black hover:bg-green-300'
                    }
                  `}
                >
                  <Save className="w-4 h-4" />
                  {editingNoteId ? 'Update' : 'Save'}
                </button>
                {editingNoteId && (
                  <button
                    onClick={handleNewNote}
                    className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotesPanel;

