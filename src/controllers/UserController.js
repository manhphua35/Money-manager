const UserService = require('../services/UserService');

class UserController{
    async createUser(req,res){
        try {
            const { name, email, password, confirmPassword, phoneNumber } = req.body
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!email || !password || !confirmPassword) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            } else if (!isCheckEmail) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The input is email'
                })
            } else if (password !== confirmPassword) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The password is equal confirmPassword'
                })
            }
            const response = await UserService.createUser(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async loginUser(req,res){
        try {
            const { email, password } = req.body
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!email || !password) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            } else if (!isCheckEmail) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is email'
                })
            }
            const response = await UserService.loginUser(req.body)
            res.cookie('userId', response.data, {
                httpOnly: false,
                secure: false,
                sameSite: 'strict',
                path: '/',
            })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async logout(req,res){
        try {
            res.clearCookie('userId', { path: '/' });
            return res.status(200).json({
                status: 'OK',
                message: 'Logout successfully'
            })
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async getProfile(req,res){
        try {
            const userId = req.cookies.userId 
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'User ID is required'
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
                message: 'Internal Server Error',
                error: error.message
            })
        }
    }

    async updateDataUser(req, res) {
        try {
            const userId = req.cookies.userId;
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'User ID is required'
                });
            }
    
            const updateData = req.body;
            const response = await UserService.updateDataUser(userId, updateData);
            console.log(response)
            if (response.status === 'OK') {
                return res.status(200).json(response);
            } else {
                return res.status(400).json(response);
            }
        } catch (error) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Internal Server Error',
                error: error.message
            });
        }
    }
    
    async changePassword(req, res) {
        try {
            const userId = req.cookies.userId
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'User ID is required'
                })
            }
    
            const { oldPassword, newPassword } = req.body
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Old password and new password are required'
                })
            }
    
            const response = await UserService.changePassword( userId, oldPassword, newPassword )
            if (response.status === 'OK') {
                return res.status(200).json(response)
            } else {
                return res.status(400).json(response)
            }
        } catch (error) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Internal Server Error',
                error: error.message
            })
        }
    }
    
}

module.exports = new UserController();