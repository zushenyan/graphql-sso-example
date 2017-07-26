const endpoint = {
  graphql: "/graphql"
};

const fetchQL = ({ query, variables = ``, queryName }) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  const init = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  };
  return fetch(endpoint.graphql, init)
    .then((res) => res.json())
    .then((res) =>
      res.errors ? Promise.reject(res) :
      queryName ? res.data[queryName] :
      res.data
    );
};

const fragmentResponseType = `
  fragment ResponseType on Response {
    message
    status
  }
`;

const fragmentUserType = `
  fragment UserType on User {
    id
    email
    token
    about
    facebook_id
    google_id
    created_at
    updated_at
    message
    status
  }
`;

const fragmentUserListType = `
  fragment UserListType on UserList {
    users {
      id
      email
      token
      about
      facebook_id
      google_id
      created_at
      updated_at
    },
    message,
    status
  }
`;

export const getCurrentUser = () => {
  const queryName = "getCurrentUser";
  const query = `
    {
      ${queryName} {
        ...UserType
      }
    }
    ${fragmentUserType}
  `;
  return fetchQL({ query, queryName });
};

export const getAllUsers = () => {
  const queryName = "getAllUsers";
  const query = `
    {
      ${queryName} {
        ...UserListType
      }
    }
    ${fragmentUserListType}
  `;
  return fetchQL({ query, queryName });
};

export const signIn = (email, password) => {
  const queryName = "signIn";
  const variables = `
    {
      "email": "${email}",
      "password": "${password}"
    }
  `;
  const query = `
    mutation signIn($email: String!, $password: String!){
      ${queryName}(email: $email, password: $password){
        ...UserType
      }
    }
    ${fragmentUserType}
  `;
  return fetchQL({ query, variables, queryName });
};

export const signInWithFacebook = (userId, accessToken) => {
  const queryName = "signInWithFacebook";
  const variables = `
    {
      "userId": "${userId}",
      "accessToken": "${accessToken}"
    }
  `;
  const query = `
    mutation signInWithFacebook($userId: String!, $accessToken: String!){
      ${queryName} (userId: $userId, accessToken: $accessToken){
        ...UserType
      }
    }
    ${fragmentUserType}
  `;
  return fetchQL({ query, variables, queryName });
};

export const signInWithGoogle = (token) => {
  const queryName = "signInWithGoogle";
  const variables = `
    {
      "token": "${token}"
    }
  `;
  const query = `
    mutation signInWithGoogle($token: String!){
      ${queryName} (token: $token){
        ...UserType
      }
    }
    ${fragmentUserType}
  `;
  return fetchQL({ query, variables, queryName });
};

export const signUp = (email, password, confirmPassword) => {
  const queryName = "signUp";
  const variables = `
    {
      "email": "${email}",
      "password": "${password}",
      "confirmPassword": "${confirmPassword}"
    }
  `;
  const query = `
    mutation signUp($email: String!, $password: String!, $confirmPassword: String!){
      ${queryName} (email: $email, password: $password, confirmPassword: $confirmPassword){
        ...UserType
      }
    }
    ${fragmentUserType}
  `;
  return fetchQL({ query, variables, queryName});
};

export const updateUser = (data) => {
  const queryName = "updateUser";
  const variables = `
    {
      "data": ${JSON.stringify(data)}
    }
  `;
  const query = `
    mutation updateUser($data: UserInput!){
      ${queryName} (data: $data){
        ...UserType
      }
    }
    ${fragmentUserType}
  `;
  return fetchQL({ query, variables, queryName });
};

export const signOut = () => {
  const queryName = "signOut";
  const query = `
    mutation signOut{
      ${queryName} {
        ...ResponseType
      }
    }
    ${fragmentResponseType}
  `;
  return fetchQL({ query, queryName });
};
