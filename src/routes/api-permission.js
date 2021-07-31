const permission = {
  'CREATE_BOOK': ['AUTHOR'],
  'GET_BOOK': ['AUTHOR', 'ADMIN', 'READER'],
  'UPDATE_BOOK': ['AUTHOR', 'ADMIN'],
  'GET_BOOK_LIST': ['AUTHOR', 'ADMIN', 'READER', 'VISITOR'],
  'UPLOAD_BOOK': ['AUTHOR'],
  'ADD_BOOKMARK': ['READER'],
  'ADD_RATING': ['READER'],
  'DOWNLOAD_BOOK': ['READER'],
  'APPROVE_BOOK': ['ADMIN'],
}

module.exports = permission;