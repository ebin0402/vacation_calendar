// Firebase Storage management for vacation data
const Storage = {
    // Get all vacations
    getVacations(callback) {
        database.ref('vacations').once('value', (snapshot) => {
            const data = snapshot.val();
            const vacations = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) : [];
            callback(vacations);
        });
    },

    // Add a vacation
    addVacation(vacation, callback) {
        const newVacationRef = database.ref('vacations').push();
        vacation.id = newVacationRef.key;
        newVacationRef.set(vacation).then(() => {
            callback(vacation);
        });
    },

    // Delete a vacation
    deleteVacation(id, callback) {
        database.ref('vacations/' + id).once('value', (snapshot) => {
            const vacation = snapshot.val();
            database.ref('vacations/' + id).remove().then(() => {
                callback(vacation);
            });
        });
    },

    // Check for overlapping vacations
    checkOverlap(memberName, startDate, endDate, excludeId, callback) {
        this.getVacations((vacations) => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            for (let vacation of vacations) {
                if (vacation.id === excludeId) continue;
                if (vacation.memberName.toLowerCase() !== memberName.toLowerCase()) continue;

                const vStart = new Date(vacation.startDate);
                const vEnd = new Date(vacation.endDate);

                if ((start >= vStart && start <= vEnd) ||
                    (end >= vStart && end <= vEnd) ||
                    (start <= vStart && end >= vEnd)) {
                    callback(vacation);
                    return;
                }
            }
            callback(null);
        });
    },

    // Get vacations by role
    getVacationsByRole(role, callback) {
        this.getVacations((vacations) => {
            callback(vacations.filter(v => v.role === role));
        });
    },

    // Get vacations for date range
    getVacationsInRange(startDate, endDate, role, callback) {
        this.getVacations((vacations) => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const filtered = vacations.filter(v => {
                if (role && v.role !== role) return false;
                const vStart = new Date(v.startDate);
                const vEnd = new Date(v.endDate);
                return (vStart <= end && vEnd >= start);
            });
            callback(filtered);
        });
    },

    // Get notes
    getNotes(callback) {
        database.ref('notes').once('value', (snapshot) => {
            callback(snapshot.val() || '');
        });
    },

    // Save notes
    saveNotes(notes) {
        database.ref('notes').set(notes);
    },

    // Get change logs
    getChangeLogs(callback) {
        database.ref('changeLogs').orderByChild('timestamp').limitToLast(100).once('value', (snapshot) => {
            const data = snapshot.val();
            const logs = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).reverse() : [];
            callback(logs);
        });
    },

    // Add change log
    addChangeLog(action, vacation) {
        const log = {
            action: action,
            vacation: vacation,
            timestamp: new Date().toISOString(),
            user: Auth.getCurrentUser()
        };
        database.ref('changeLogs').push(log);
    },

    // Listen for real-time updates
    onVacationsChange(callback) {
        database.ref('vacations').on('value', (snapshot) => {
            const data = snapshot.val();
            const vacations = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) : [];
            callback(vacations);
        });
    }
};