// Global app state
let state = {
  editingId: null,     // ID of record currently being edited
  patients: [],        // list of all patients
  doctors: [],         // list of all doctors
  bills: []            // list of all bills
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}
