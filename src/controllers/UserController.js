const UserService = require('../services/UserService');

class UserController {
    async createUser(req, res) {
        try {
            const { name, email, password, confirmPassword, phoneNumber } = req.body;
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            const isCheckEmail = reg.test(email);
            if (!email || !password || !confirmPassword) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Vui lòng nhập đầy đủ thông tin'
                });
            } else if (!isCheckEmail) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Email không hợp lệ'
                });
            } else if (password !== confirmPassword) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Mật khẩu và xác nhận mật khẩu không khớp'
                });
            }
            const response = await UserService.createUser(req.body);
            if (response.status === 'OK') {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(404).json({
                message: error.message
            });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            const isCheckEmail = reg.test(email);
            if (!email || !password) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Vui lòng nhập đầy đủ thông tin'
                });
            } else if (!isCheckEmail) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Email không hợp lệ'
                });
            }
            const response = await UserService.loginUser(req.body);
            if (response.status === 'OK') {
                res.cookie('userId', response.data, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'strict',
                    path: '/',
                });
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(404).json({
                message: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('userId', { path: '/' });
            return res.status(200).json({
                status: 'OK',
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            return res.status(404).json({
                message: error.message
            });
        }
    }

    async getProfile(req, res) {
        try {
            const userId = req.cookies.userId;
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Yêu cầu ID người dùng'
                });
            }
            const response = await UserService.getProfile(userId);
            if (response.status === 'OK') {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Lỗi máy chủ nội bộ',
                error: error.message
            });
        }
    }

    async updateDataUser(req, res) {
        try {
            const userId = req.cookies.userId;
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Yêu cầu ID người dùng'
                });
            }

            const updateData = req.body;
            const response = await UserService.updateDataUser(userId, updateData);
            if (response.status === 'OK') {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Lỗi máy chủ nội bộ',
                error: error.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.cookies.userId;
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Yêu cầu ID người dùng'
                });
            }

            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Mật khẩu cũ và mật khẩu mới không được bỏ trống'
                });
            }

            const response = await UserService.changePassword(userId, oldPassword, newPassword);
            if (response.status === 'OK') {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Lỗi máy chủ nội bộ',
                error: error.message
            });
        }
    }
}

module.exports = new UserController();
