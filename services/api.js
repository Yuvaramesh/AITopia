export async function createNewRoom(data) {
    const res = await fetch('/api/discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create discussion room');
    }
    return await res.json();
}

export async function getDiscussionRoom(id) {
    const res = await fetch(`/api/discussion?id=${id}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch discussion room');
    }
    return await res.json();
}

export async function updateDiscussionRoom(updateData) {
    const res = await fetch('/api/discussion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update discussion room');
    }
    return await res.json();
}

export async function getAllDiscussionRooms(uid) {
    const res = await fetch(`/api/discussion?uid=${uid}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch discussion rooms');
    }
    return await res.json();
}

export async function createStudyMaterial(data) {
    const res = await fetch('/api/studyMaterial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create study material');
    }
    return await res.json();
}

export async function getCourseNotes(courseId) {
    const res = await fetch(`/api/courseNotes?courseId=${courseId}`);
    if (res.status === 404) {
        // No notes exist; return an empty object or handle it as desired.
        return { notes: "" };
    }
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch course notes');
    }
    return await res.json();
}

export async function createCourseNotes(data) {
    const res = await fetch('/api/courseNotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create course notes');
    }
    return await res.json();
}


export async function getCourseFlashcards(courseId) {
    const res = await fetch(`/api/flashcards?courseId=${courseId}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch course flashcards');
    }
    return await res.json();
}

export async function createCourseFlashcards(data) {
    const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create course flashcards');
    }
    return await res.json();
}