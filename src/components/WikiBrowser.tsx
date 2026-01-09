import { useState, useEffect } from 'react';
import { wikiService } from '../services/wikiService';
import { WikiPage } from '../types';
import './WikiBrowser.css';

function WikiBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WikiPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [autocomplete, setAutocomplete] = useState<string[]>([]);

  useEffect(() => {
    wikiService.loadRecentSearches();
    wikiService.loadBookmarks();
    setRecentSearches(wikiService.getRecentSearches());
    setBookmarks(wikiService.getBookmarks());
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const suggestions = await wikiService.getAutocomplete(searchQuery);
        setAutocomplete(suggestions);
      } else {
        setAutocomplete([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSelectedPage(null);
    try {
      const results = await wikiService.search(searchTerm, 20);
      setSearchResults(results);
      setRecentSearches(wikiService.getRecentSearches());
      setAutocomplete([]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = async (title: string) => {
    setLoading(true);
    try {
      const page = await wikiService.getPage(title);
      setSelectedPage(page);
    } catch (error) {
      console.error('Failed to load page:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (title: string) => {
    if (wikiService.isBookmarked(title)) {
      wikiService.removeBookmark(title);
    } else {
      wikiService.addBookmark(title);
    }
    setBookmarks(wikiService.getBookmarks());
  };

  const clearRecentSearches = () => {
    wikiService.clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div className="wiki-browser">
      <div className="wiki-container">
        <div className="search-section">
          <h2>📚 RuneScape Wiki Browser</h2>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search wiki (items, monsters, quests...)"
              className="search-input"
            />
            <button onClick={() => handleSearch()} disabled={loading} className="search-button">
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>

          {autocomplete.length > 0 && (
            <div className="autocomplete-dropdown fade-in">
              {autocomplete.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="autocomplete-item"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="wiki-content">
          <div className="sidebar">
            {recentSearches.length > 0 && (
              <div className="sidebar-section">
                <div className="sidebar-header">
                  <h4>🕒 Recent Searches</h4>
                  <button onClick={clearRecentSearches} className="clear-btn-small">
                    Clear
                  </button>
                </div>
                <div className="recent-list">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(search)}
                      className="recent-item"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bookmarks.length > 0 && (
              <div className="sidebar-section">
                <h4>⭐ Bookmarks</h4>
                <div className="bookmarks-list">
                  {bookmarks.map((bookmark, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageSelect(bookmark)}
                      className="bookmark-item"
                    >
                      {bookmark}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="sidebar-section">
              <h4>📖 Quick Links</h4>
              <div className="quick-links">
                <button onClick={() => handleSearch('Grand Exchange')} className="quick-link">
                  Grand Exchange
                </button>
                <button onClick={() => handleSearch('Money making guide')} className="quick-link">
                  Money Making
                </button>
                <button onClick={() => handleSearch('Quest list')} className="quick-link">
                  Quest List
                </button>
                <button onClick={() => handleSearch('Skill training')} className="quick-link">
                  Skill Training
                </button>
              </div>
            </div>
          </div>

          <div className="main-content">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading...</p>
              </div>
            )}

            {!loading && searchResults.length > 0 && !selectedPage && (
              <div className="search-results fade-in">
                <h3>Search Results ({searchResults.length})</h3>
                <div className="results-grid">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="result-card"
                      onClick={() => handlePageSelect(result.title)}
                    >
                      <div className="result-header">
                        <h4>{result.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(result.title);
                          }}
                          className="bookmark-btn"
                        >
                          {wikiService.isBookmarked(result.title) ? '⭐' : '☆'}
                        </button>
                      </div>
                      {result.excerpt && (
                        <p className="result-excerpt">{result.excerpt}</p>
                      )}
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="external-link">
                        View on Wiki →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && selectedPage && (
              <div className="page-view fade-in">
                <div className="page-header">
                  <div>
                    <button onClick={() => setSelectedPage(null)} className="back-btn">
                      ← Back to Results
                    </button>
                    <h3>{selectedPage.parse?.title}</h3>
                  </div>
                  <button
                    onClick={() => toggleBookmark(selectedPage.parse?.title)}
                    className="bookmark-btn-large"
                  >
                    {wikiService.isBookmarked(selectedPage.parse?.title) ? '⭐ Bookmarked' : '☆ Bookmark'}
                  </button>
                </div>

                <div className="page-content">
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedPage.parse?.text['*'] || '' }}
                    className="wiki-content-html"
                  />
                </div>

                {selectedPage.parse?.categories && selectedPage.parse.categories.length > 0 && (
                  <div className="page-categories">
                    <h4>Categories:</h4>
                    <div className="categories-list">
                      {selectedPage.parse.categories.map((cat: any, idx: number) => (
                        <span key={idx} className="category-badge">
                          {cat['*'].replace('Category:', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && searchResults.length === 0 && !selectedPage && (
              <div className="empty-state">
                <h3>🔍 Search the RuneScape Wiki</h3>
                <p>Find information about items, monsters, quests, skills, and more!</p>
                <ul className="features">
                  <li>✨ Instant search with autocomplete</li>
                  <li>📖 Full wiki page viewing</li>
                  <li>⭐ Bookmark your favorite pages</li>
                  <li>🕒 Recent search history</li>
                  <li>💾 Offline caching for faster access</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WikiBrowser;
