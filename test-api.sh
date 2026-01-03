#!/bin/bash

# Configuration
API_URL="http://localhost:3001"
COOKIE_FILE="cookies.txt"

# Cleanup cookies from previous runs
rm -f $COOKIE_FILE

echo "Waiting for server to be ready..."
until curl -s $API_URL/auth/login > /dev/null; do
  sleep 2
done

# Helper function to print results
print_result() {
  if [ $1 -eq 0 ]; then
    echo "PASSED: $2"
  else
    echo "FAILED: $2"
    exit 1
  fi
}

echo "=== 1. Registering first user (should be admin) ==="
REGISTER_ADMIN=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c $COOKIE_FILE)

echo $REGISTER_ADMIN | grep -q '"role":"admin"'
print_result $? "First user registered as admin"

# Extract user ID for later use
USER_ADMIN_ID=$(echo $REGISTER_ADMIN | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
if [ -z "$USER_ADMIN_ID" ]; then
  USER_ADMIN_ID=$(echo $REGISTER_ADMIN | sed -n 's/.*"_id":"\([^"]*\)".*/\1/p')
fi

echo "=== 2. Registering second user (should be regular user) ==="
REGISTER_USER=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c $COOKIE_FILE)

echo $REGISTER_USER | grep -q '"role":"user"'
print_result $? "Second user registered as 'user'"

USER_REGULAR_ID=$(echo $REGISTER_USER | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
if [ -z "$USER_REGULAR_ID" ]; then
  USER_REGULAR_ID=$(echo $REGISTER_USER | sed -n 's/.*"_id":"\([^"]*\)".*/\1/p')
fi

echo "=== 3. Verifying /me for regular user ==="
ME_USER=$(curl -s -X GET $API_URL/users/me \
  -b $COOKIE_FILE)

echo $ME_USER | grep -q '"email":"user@example.com"'
print_result $? "/me works for regular user"

echo "=== 4. Attempting admin access as regular user (should fail 403) ==="
ADMIN_USERS_FAIL=$(curl -s -o /dev/null -w "%{http_code}" -X GET $API_URL/admin/users \
  -b $COOKIE_FILE)

if [ "$ADMIN_USERS_FAIL" == "403" ]; then
  print_result 0 "Regular user denied access to admin routes"
else
  print_result 1 "Regular user should have been denied access (Got $ADMIN_USERS_FAIL)"
fi

echo "=== 5. Logging in as admin ==="
rm -f $COOKIE_FILE
LOGIN_ADMIN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c $COOKIE_FILE)

echo $LOGIN_ADMIN | grep -q '"role":"admin"'
print_result $? "Admin logged in successfully"

echo "=== 6. Accessing admin users list ==="
ADMIN_USERS_LIST=$(curl -s -X GET $API_URL/admin/users \
  -b $COOKIE_FILE)

echo $ADMIN_USERS_LIST | grep -q '"email":"user@example.com"'
print_result $? "Admin can list all users"

echo "=== 7. Updating user role to admin ==="
UPDATE_ROLE=$(curl -s -X PATCH $API_URL/admin/users/$USER_REGULAR_ID/role \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
  -b $COOKIE_FILE)

echo $UPDATE_ROLE | grep -q '"role":"admin"'
print_result $? "User role updated to admin"

echo "=== 8. Logging out ==="
LOGOUT=$(curl -s -X POST $API_URL/auth/logout \
  -b $COOKIE_FILE)

echo $LOGOUT | grep -q "Logged out successfully"
print_result $? "Logout successful"

echo "=== 9. Verifying /me after logout (should fail 401) ==="
ME_FAIL=$(curl -s -o /dev/null -w "%{http_code}" -X GET $API_URL/users/me \
  -b $COOKIE_FILE)

if [ "$ME_FAIL" == "401" ]; then
  print_result 0 "Access denied after logout"
else
  print_result 1 "Should have been denied access (Got $ME_FAIL)"
fi

echo "=== All tests passed successfully! ==="
rm -f $COOKIE_FILE
