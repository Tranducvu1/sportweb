import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import httpRequest, { get } from  '../../../../utils/httpRequest';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [userForm, setUserForm] = useState({
        email: '',
        hoten: '',
        role: '',
    });
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch users with optional search filters
    const fetchUsers = async (searchParams = {}) => {
        setIsLoading(true);
        try {
            const response = await get('users', { params: searchParams });
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle user search
    const handleSearch = () => {
        const searchParams = {};
        if (searchTerm) {
            searchParams.email = searchTerm;
        }
        fetchUsers(searchParams);
    };

    // Add new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await httpRequest.post('users/create', userForm);
            setUsers([...users, response.data]);
            setShowAddUserForm(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    // Delete user
    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await httpRequest.delete(`users/${id}`);
                setUsers(users.filter((user) => user.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // Show user details
    const handleShowDetails = async (id) => {
        setIsLoading(true);
        try {
            const response = await get(`users/${id}`);
            setSelectedUser(response);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <Sidebar />
            <div className="col-md-9 animated bounce header-h3">
                <h3 className="page-header">Quản lý người dùng</h3>
                <hr />

                {/* User Search */}
                <div className="flex justify-end mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm người dùng"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                {/* Add User Button */}
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={() => setShowAddUserForm(true)}>
                        Thêm người dùng
                    </button>
                </div>

                {/* Add User Form */}
                {showAddUserForm && (
                    <form onSubmit={handleAddUser}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={userForm.email}
                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hoten">Họ tên</label>
                            <input
                                type="text"
                                id="hoten"
                                className="form-control"
                                value={userForm.hoten}
                                onChange={(e) => setUserForm({ ...userForm, hoten: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Vai trò</label>
                            <select
                                id="role"
                                className="form-control"
                                value={userForm.role}
                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                            >
                                <option value="">Chọn vai trò</option>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">
                            Thêm người dùng
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => setShowAddUserForm(false)}
                        >
                            Hủy
                        </button>
                    </form>
                )}

                {/* User List Table */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Họ tên</th>
                            <th>Vai trò</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.hoten}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleShowDetails(user.id)}
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* User Detail Modal */}
                {showDetailModal && selectedUser && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                ×
                            </button>
                            <h3>Chi tiết người dùng</h3>
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Họ tên:</strong> {selectedUser.hoten}</p>
                            <p><strong>Vai trò:</strong> {selectedUser.role}</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
