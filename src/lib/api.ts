import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const endpoints = {
    auth: {
        login: "/auth/login",
    },
    student: {
        profile: (id: string) => `/student/me/${id}`,
    },
    students: {
        getAll: "/students/",
        add: "/students/add",
        delete: (id: string) => `/students/${id}`,
        update: (id: string) => `/students/${id}`,
    },
    teachers: {
        getAll: "/teachers/",
        add: "/teachers/add",
        delete: (id: string) => `/teachers/${id}`,
        update: (id: string) => `/teachers/${id}`,
    },
    attendance: {
        mark: "/attendance/mark",
        recognize: "/face/recognize",
        today: "/attendance/today",
        stats: "/attendance/stats",
        adminStats: "/stats/admin",
    },
    leave: {
        apply: "/leave/apply",
        getByUser: (id: string) => `/leave/user/${id}`,
        pending: "/leave/pending",
        approve: (id: string, status: string) => `/leave/approve/${id}?status=${status}`,
    },
    gatepass: {
        pending: "/gatepass/pending",
        approve: (id: string, status: string) => `/gatepass/approve/${id}?status=${status}`,
    },
    notices: {
        getAll: "/notices/",
        add: "/notices/add",
        upload: "/notices/upload",
        delete: (id: string) => `/notices/${id}`,
    },
    placements: {
        getAll: "/placements/",
        getById: (id: string) => `/placements/${id}`,
        add: "/placements/add",
        delete: (id: string) => `/placements/${id}`,
        uploadResume: "/placements/upload_resume",
        getApplications: "/placements/applications",
    },
    timetable: {
        getDay: (day: string) => `/timetable/day/${day}`,
        add: "/timetable/add",
        delete: (id: string) => `/timetable/${id}`,
    },
    documents: {
        upload: "/documents/upload",
        getAll: (type?: string) => `/documents/${type ? `?fileType=${type}` : ""}`,
        delete: (id: string) => `/documents/${id}`,
    }
};
