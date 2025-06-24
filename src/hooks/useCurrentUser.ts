
const MOCK_USER_JENNIFER = { id: "11111111-1111-1111-1111-111111111111", name: "Jennifer Smith" };
const MOCK_USER_SARAH = { id: "00000000-0000-0000-0000-000000000001", name: "Sarah Chen" };

// Now return Sarah as the current user instead of Jennifer
export function useCurrentUser() {
  return MOCK_USER_SARAH;
}

