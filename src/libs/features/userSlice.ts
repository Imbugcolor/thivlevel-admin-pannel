// Define the initial state using that type
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {User} from "@/libs/interfaces/schema/user.interface";
import {UserFilterQuery} from "@/app/fetch/user.admin.api";

export interface UsersPayload {
    data: User[];
    total: number;
    page: number;
}

export interface UsersState {
    data: User[];
    total: number;
    page: number;
    filter: UserFilterQuery;
}

const initialState: UsersState = {
    data: [],
    total: 0,
    page: 1,
    filter: {
        search: "",
        sort: "-createdAt",
        role: "",
    },
};

export const UserSlice = createSlice({
    name: "users",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        getUsers: (state, action: PayloadAction<UsersPayload>) => {
            state.data = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
        },
        searchUsers: (state, action: PayloadAction<string>) => {
            state.filter.search = action.payload;
        },
        sortUsers: (state, action: PayloadAction<string>) => {
            state.filter.sort = action.payload;
        },
        filterUsersByRole: (state, action: PayloadAction<string>) => {
            state.filter.role = action.payload;
        },
        changeUserPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        clearUserFilter: (state) => {
            state.filter = {
                search: "",
                sort: "-createdAt",
                role: "",
            };
        },
    },
});

export const {
    getUsers,
    searchUsers,
    sortUsers,
    filterUsersByRole,
    changeUserPage,
    clearUserFilter,
} = UserSlice.actions;

export default UserSlice.reducer;
