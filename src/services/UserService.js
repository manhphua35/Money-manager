const User = require('../models/User');
const bcrypt = require('bcrypt');
class UserService{
    async createUser(newUser){
        const { name, email, password, phoneNumber } = newUser;
        try {
            const checkUser = await User.findOne({ email: email });
            
            if (checkUser !== null) {
                return {
                    status: 'ERR',
                    message: 'The email is already in use'
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
                    message: 'User created successfully',
                    data: createdUser
                };
            }
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Error creating user',
                error: error.message
            };
        }
    }
    
    async loginUser(userLogin){
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                return({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                return({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }
            return({
                status: 'OK',
                message: 'SUCCESS',
                data: checkUser.id
        })
        } catch (error) {
            reject(error)
        }    
    }

    async getProfile(userId){
        try {
            const user = await User.findById(userId).select('-password -spending -income -createdAt -updatedAt -__v -_id')
            if (!user) {
                return {
                    status: 'ERR',
                    message: 'User not found'
                };
            }
    
            return {
                status: 'OK',
                message: 'User profile fetched successfully',
                data: user
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Error fetching user profile',
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
                    message: 'User not found'
                };
            }
    
            return {
                status: 'OK',
                message: 'User data updated successfully',
                data: updatedUser
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Error updating user data',
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
                    message: 'User not found'
                };
            }
    
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return {
                    status: 'ERR',
                    message: 'Old password is incorrect'
                };
            }
    
            const hash = bcrypt.hashSync(newPassword, 10);
            user.password = hash;
            await user.save();
    
            return {
                status: 'OK',
                message: 'Password changed successfully'
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: 'Error changing password',
                error: error.message
            };
        }
    }
}

module.exports = new UserService();