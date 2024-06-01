const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
    async createUser(newUser) {
        const { name, email, password, phoneNumber } = newUser;
        try {
            const checkUser = await User.findOne({ email: email });
            
            if (checkUser !== null) {
                return {
                    status: 'ERR',
                    message: 'Email đã được sử dụng'
                };
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone: phoneNumber
            });
            
            if (createdUser) {
                return {
                    status: 'OK',
                    message: 'Tạo tài khoản thành công',
                    data: createdUser
                };
            }
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Lỗi khi tạo tài khoản',
                error: error.message
            };
        }
    }
    
    async loginUser(userLogin) {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                return {
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                };
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return {
                    status: 'ERR',
                    message: 'Mật khẩu hoặc người dùng không chính xác'
                };
            }
            return {
                status: 'OK',
                message: 'Đăng nhập thành công',
                data: checkUser.id
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Lỗi khi đăng nhập',
                error: error.message
            };
        }
    }

    async getProfile(userId) {
        try {
            const user = await User.findById(userId).select('-password -spending -income -createdAt -updatedAt -__v -_id');
            if (!user) {
                return {
                    status: 'ERR',
                    message: 'Không tìm thấy người dùng'
                };
            }
    
            return {
                status: 'OK',
                message: 'Lấy thông tin người dùng thành công',
                data: user
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Lỗi khi lấy thông tin người dùng',
                error: error.message
            };
        }
    }

    async updateDataUser(userId, updateData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password -spending -income -createdAt -updatedAt -__v -_id');
            
            if (!updatedUser) {
                return {
                    status: 'ERR',
                    message: 'Không tìm thấy người dùng'
                };
            }
    
            return {
                status: 'OK',
                message: 'Cập nhật thông tin người dùng thành công',
                data: updatedUser
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Lỗi khi cập nhật thông tin người dùng',
                error: error.message
            };
        }
    }

    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await User.findById(userId);
            
            if (!user) {
                return {
                    status: 'ERR',
                    message: 'Không tìm thấy người dùng'
                };
            }
    
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return {
                    status: 'ERR',
                    message: 'Mật khẩu cũ không chính xác'
                };
            }
    
            const hash = bcrypt.hashSync(newPassword, 10);
            user.password = hash;
            await user.save();
    
            return {
                status: 'OK',
                message: 'Đổi mật khẩu thành công'
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Lỗi khi đổi mật khẩu',
                error: error.message
            };
        }
    }
}

module.exports = new UserService();
