import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Assistant from './pages/Assistant';
import Standards from './pages/Standards';
import Services from './pages/Services';
import About from './pages/About';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [userMode, setUserMode] = useState('industry');
  const [activeTab, setActiveTab] = useState('assistant');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState('all');
  const [browseStandards, setBrowseStandards] = useState([]);
  const [loadingBrowse, setLoadingBrowse] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  // Initial welcome message based on mode
  useEffect(() => {
    const welcomeText = userMode === 'industry'
      ? 'Welcome to BIS-SAARTHI (Industry Portal). I am your compliance assistant. Ask me questions about product certification (ISI Mark/FMCS), testing requirements, quality control orders (QCOs), or explain standard clauses.'
      : 'Welcome to BIS-SAARTHI (Consumer Portal). I am your standards helper. Ask me how to verify ISI certification licenses, verify gold jewellery hallmarks (HUID), file complaints, or understand product safety markings.';
    
    setMessages([
      {
        role: 'assistant',
        content: welcomeText,
        matched_standards: [],
        sources: [],
        next_actions: [],
        timestamp: new Date()
      }
    ]);
  }, [userMode]);

  const fetchStandards = useCallback(async () => {
    setLoadingBrowse(true);
    try {
      const url = selectedSector === 'all' 
        ? `${API_BASE}/api/standards` 
        : `${API_BASE}/api/standards?sector=${encodeURIComponent(selectedSector)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBrowseStandards(data);
      } else {
        console.error('Failed to fetch standards');
      }
    } catch (err) {
      console.error('Error fetching standards:', err);
    } finally {
      setLoadingBrowse(false);
    }
  }, [selectedSector]);

  // Fetch standards for the Browse tab
  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  // Run a natural language query
  const handleQuerySubmit = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const activeQuery = textOverride || query;
    if (!activeQuery.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: activeQuery,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setQuery('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: activeQuery })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer,
          intent: data.intent,
          matched_standards: data.matched_standards,
          sources: data.sources,
          retrieval_score: data.retrieval_score,
          evidence_status: data.evidence_status,
          next_actions: data.next_actions,
          timestamp: new Date()
        }]);
      } else {
        await response.json().catch(() => ({}));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Something went wrong while retrieving BIS information.`,
          isError: true,
          matched_standards: [],
          sources: [],
          next_actions: [],
          timestamp: new Date()
        }]);
      }
    } catch (_err) {
      console.error('Query execution failed:', _err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to connect to the backend server. Please verify the backend Flask application is running.',
        isError: true,
        matched_standards: [],
        sources: [],
        next_actions: [],
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSeeding = async () => {
    if (!confirm('This will seed the database with verified BIS standards metadata and document chunks. Do you want to proceed?')) return;
    
    setIsSeeding(true);
    try {
      const response = await fetch(`${API_BASE}/api/seed-embeddings`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchStandards(); // Refresh list
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (_err) {
      console.error('Database seeding failed:', _err);
      alert('Failed to reach seeding API. Make sure the backend Flask app is running.');
    } finally {
      setIsSeeding(false);
    }
  };

  // Pre-configured suggestions based on current mode
  const suggestions = {
    industry: [
      { text: "How do I apply for ISI certification (licence)?", label: "Apply ISI License" },
      { text: "What are the testing requirements for PVC cables (IS 694)?", label: "IS 694 Testing Requirements" },
      { text: "Explain FMCS foreign manufacturer certification guidelines", label: "Foreign FMCS Guidelines" },
      { text: "Is ISI mark mandatory for packaged drinking water?", label: "Mandatory Water QCO" }
    ],
    consumer: [
      { text: "How do I verify a 6-digit gold jewellery Hallmark (HUID)?", label: "Verify gold Hallmark" },
      { text: "How do I register a complaint for a substandard product?", label: "File Product Complaint" },
      { text: "What is the purpose of the BIS CARE app?", label: "Use BIS CARE App" },
      { text: "What are the specifications for infant cereal food (IS 11536)?", label: "Infant Food IS 11536" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden pb-16 md:pb-0">
        {/* Header Banner */}
        <Header 
          userMode={userMode} 
          setUserMode={setUserMode} 
          onTriggerSeeding={handleTriggerSeeding}
          isSeeding={isSeeding}
        />

        {/* Dynamic Pages */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col overflow-y-auto">
          {activeTab === 'assistant' && (
            <Assistant
              userMode={userMode}
              setUserMode={setUserMode}
              setActiveTab={setActiveTab}
              messages={messages}
              loading={loading}
              query={query}
              setQuery={setQuery}
              handleQuerySubmit={handleQuerySubmit}
              suggestions={suggestions}
            />
          )}

          {activeTab === 'browse' && (
            <Standards
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              browseStandards={browseStandards}
              loadingBrowse={loadingBrowse}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            />
          )}

          {activeTab === 'services' && (
            <Services />
          )}

          {activeTab === 'about' && (
            <About />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
