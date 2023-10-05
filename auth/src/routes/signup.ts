import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '@cbgetticket/common';
import { User } from '../models/User';
import { BadRequestError } from '@cbgetticket/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
        .isEmail()
        .withMessage('Email must be valid!'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 to 20 characters!')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        //console.log('console-Email is in use.');
        throw new BadRequestError('Email in use.');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY!   // ! is used to tell typescript to dont worry and it's defined somewhere else
    );
  
      // Store it on session object
    req.session = {
      jwt: userJwt
    };
    
    //console.log('console-Creating a user....');
    res.status(201).send(user);
  }
)

export { router as signupRouter };