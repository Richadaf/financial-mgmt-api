
# API Documentation

This document outlines how to interact with our API endpoints. **Follow each request step by step to test the flow.**

## Authentication

### Register

- **URL:** localhost:3000/v1/users/register
- **Method:** POST
- **Body:**

```json

{
  "username": "michaeljackson",
  "password": "hehe"
}
```

### Login

- **URL:** localhost:3000/v1/users/login
- **Method:** POST
- **Body:**

```json

{
  "username": "michaeljackson",
  "password": "hehe"
}
```

After logging in, copy the token from the response. This will be used for the next requests.

### Logout from all devices

- **URL:** localhost:3000/v1/users/logoutAll
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

**Note:** **This request will not work if you are not an admin. Let's change that.**

### Switch to Admin Role

- **Method:** POST# API Documentation

This document outlines how to interact with our API endpoints. 

## Authentication

### Register

- **URL:** localhost:3000/v1/users/register
- **Method:** POST
- **Body:**

```json

{
  "username": "michaeljackson",
  "password": "hehe"
}
```

### Login

- **URL:** localhost:3000/v1/users/login
- **Method:** POST
- **Body:**

```json

{
  "username": "michaeljackson",
  "password": "hehe"
}
```

After logging in, copy the token from the response. This will be used for the next requests.

### Logout from all devices

- **URL:** localhost:3000/v1/users/logoutAll
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

**Note:** This request will not work if you are not an admin. Let's change that.

### Switch to Admin Role

- **URL:** localhost:3000/v1/users/grantAdmin
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

Now, you can try the "Logout from all devices" request again.

## Switching Roles

If you want to switch back to a user role, you can use the following request once you're logged in:

- **URL:** localhost:3000/v1/users/revokeAdmin
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

## Conclusion

This document demonstrates authentication and role-based requests. If you have any questions or need further information, please don't hesitate to ask.

- **Headers:** `Authorization: Bearer {token you copied}`

Now, you can try the "Logout from all devices" request again.

## Switching Roles

If you want to switch back to a user role, you can use the following request once you're logged in:

- **URL:** localhost:3000/v1/users/revokeAdmin
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

## Conclusion

This document demonstrates authentication and role-based requests. If you have any questions or need further information, please don't hesitate to ask.

{
  "username": "michaeljackson",
  "password": "hehe"
}
```

After logging in, copy the token from the response. This will be used for the next requests.

### Logout from all devices

- **URL:** localhost:3000/v1/users/logoutAll
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

**Note:** This request will not work if you are not an admin. Let's change that.

### Switch to Admin Role

- **URL:** localhost:3000/v1/users/grantAdmin
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

Now, you can try the "Logout from all devices" request again.

## Switching Roles

If you want to switch back to a user role, you can use the following request once you're logged in:

- **URL:** localhost:3000/v1/users/grantUser
- **Method:** POST
- **Headers:** `Authorization: Bearer {token you copied}`

## Conclusion

This document demonstrates authentication and role-based requests. If you have any questions or need further information, please don't hesitate to ask.
