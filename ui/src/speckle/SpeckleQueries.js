export const userInfoQuery = () => `query {
    activeUser {
      name
    },
    serverInfo {
      name
      company
    }
  }`

export const streamQuery = (streamId) => `query {
  stream(id: "${streamId}"){
    name
    branches {
      cursor
      items {
        id
        name
      }
    }
  }
}`

export const objectQuery = (streamId, commitId) => `query {
  stream(id: "${streamId}"){
    name
    commit(id: "${commitId}") {
      id
      branchName
      authorName
      sourceApplication
      createdAt
      totalChildrenCount
      message
      referencedObject
    }
  }
}`

export const commitQuery = (streamId, branchName) => `query {
  stream(id: "${streamId}"){
    name
    branch(name: "${branchName}") {
      commits {
        items{
          id
          message
          referencedObject
        }
      }
    }
  }
}`

export const branchQuery = (streamId, branchName) => `query {
  stream(id: "${streamId}"){
    name
    branch(name: "${branchName}") {
      commits {
        items{
          id
          message
        }
      }
    }
  }
}`

export const streamCommitsQuery = (streamId, itemsPerPage, cursor) => `query {
              stream(id: "${streamId}"){
                commits(limit: ${itemsPerPage}, cursor: ${cursor ? '"' + cursor + '"' : null}) {
                  totalCount
                  cursor
                  items{
                    id
                    message
                    branchName
                    sourceApplication
                    referencedObject
                    authorName
                    createdAt
                  }
                }
              }
            }`

export const streamSearchQuery = (search) => `query {
    StreamCollection(query: "${search}") {
      totalCount
      cursor
      items {
        id
        name
        updatedAt
      }
    }
  }`

export const queryAllStreams = () => `query {
  streams{
    totalCount
    cursor
    items {
      id
    }
  }
}
`