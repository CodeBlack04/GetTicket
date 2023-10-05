import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { PasswordManager } from '../services/password-hashing';
import { validateRequest } from '@cbgetticket/common';
import { User } from '../models/User';
import { BadRequestError } from '@cbgetticket/common';

const router = express.Router();

router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid!'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password!')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials.');
        }

        const isPasswordMatch = await PasswordManager.toCompare(existingUser.password, password);
        if (!isPasswordMatch) {
            throw new BadRequestError('Invalid credentials.');
        }
        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_KEY!   // ! is used to tell typescript to dont worry and it's defined somewhere else
        );
    
        // Store it on session object
        req.session = {
            jwt: userJwt
        };
      
        //console.log('Logged in');
        res.status(200).send(existingUser);
    }
)

export { router as signinRouter };