// Fake ISBN lookup for the prototype

const FAKE_RESULTS = {
    '9780553418026': { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', language: 'English' },
    '9780593135204': { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', language: 'English' },
    '9780441569595': { title: 'Neuromancer', author: 'William Gibson', genre: 'Science Fiction', language: 'English' },
  };
  
  // Pretend to wait for the network
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  // Returns the book details, or null when the ISBN is not found
  export async function lookUpIsbn(isbn) {
    await wait(600);
    return FAKE_RESULTS[isbn] ?? null;
  }