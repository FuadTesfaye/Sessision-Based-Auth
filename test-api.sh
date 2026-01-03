#!/bin/bash

BASE_URL="http://localhost:3000"
COOKIE_JAR="cookies.txt"

# Helper for colorful output
echo_title() { echo -e "\n\033[1;34m=== $1 ===\033[0m"; }
echo_success() { echo -e "\033[0;32mPASSED: $1\033[0m"; }
echo_failure() { echo -e "\033[0;31mFAILED: $1\033[0m"; exit 1; }

# Reset cookie jar
rm -f "$COOKIE_JAR"

echo "Waiting for server to be ready..."
sleep 5 # Give Docker a moment

echo_title "1. Registering first user (should be admin)"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -c "$COOKIE_JAR" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com", "password":"password123"}')
echo "$RESPONSE" | grep -q '"role":"admin"' || echo_failure "First user is not admin"
echo_success "First user registered as admin"

echo_title "2. Registering second user (should be regular user)"
# Clear cookies for new registration to avoid session conflict
rm -f "$COOKIE_JAR"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -c "$COOKIE_JAR" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com", "password":"password456"}')
echo "$RESPONSE" | grep -q '"role":"user"' || echo_failure "Second user is not 'user'"
echo_success "Second user registered as 'user'"

USER_ID=$(echo "$RESPONSE" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

echo_title "3. Verifying /me for regular user"
curl -s -b "$COOKIE_JAR" "$BASE_URL/auth/me" | grep -q '"email":"user@example.com"' || echo_failure "/me check failed"
echo_success "/me works for regular user"

echo_title "4. Attempting admin access as regular user (should fail 403)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR" "$BASE_URL/admin/users")
[ "$STATUS" -eq 403 ] || echo_failure "Regular user accessed admin route (Status: $STATUS)"
echo_success "Regular user denied access to admin routes"

echo_title "5. Logging in as admin"
rm -f "$COOKIE_JAR"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -c "$COOKIE_JAR" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com", "password":"password123"}')
echo "$RESPONSE" | grep -q '"role":"admin"' || echo_failure "Admin login failed"
echo_success "Admin logged in successfully"

echo_title "6. Accessing admin users list"
RESPONSE=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/admin/users")
echo "$RESPONSE" | grep -q 'admin@example.com' && echo "$RESPONSE" | grep -q 'user@example.com' || echo_failure "Could not fetch user list"
echo_success "Admin can list all users"

echo_title "7. Updating user role to admin"
RESPONSE=$(curl -s -X PATCH "$BASE_URL/admin/users/$USER_ID/role" \
  -b "$COOKIE_JAR" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}')
echo "$RESPONSE" | grep -q '"role":"admin"' || echo_failure "Role update failed"
echo_success "User role updated to admin"

echo_title "8. Logging out"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" -b "$COOKIE_JAR")
echo "$RESPONSE" | grep -q 'Logged out successfully' || echo_failure "Logout failed"
echo_success "Logout successful"

echo_title "9. Verifying /me after logout (should fail 401)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_JAR" "$BASE_URL/auth/me")
[ "$STATUS" -eq 401 ] || echo_failure "Access granted after logout (Status: $STATUS)"
echo_success "Access denied after logout"

echo_title "All tests passed successfully!"
rm -f "$COOKIE_JAR"
