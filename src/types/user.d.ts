export type TCreateUserData = {
    email: string
    password: string
    firstName: string
    lastName: string
}

export type TUserSelect = {
    id: true
    email: true
    password: true
    firstName: true
    lastName: true
    role: true
}

export type TUpdateUserData = Omit<IUser, 'id' | 'role'> & {
    role?: Role
}