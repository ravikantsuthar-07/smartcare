import express from 'express';
import {
    addSpecailizationController,
    deleteSpecailizationController,
    getSpecailizationController,
    gettingListSpecailizationController,
    updateSpecailizationController
} from '../controller/specailization.controller.js';
import { isAdmin, requireSignIn } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(`/add`, requireSignIn, isAdmin, addSpecailizationController);
router.get(`/get`, requireSignIn, isAdmin, getSpecailizationController);
router.put(`/update/:id`, requireSignIn, isAdmin, updateSpecailizationController);
router.delete(`/delete/:id`, requireSignIn, isAdmin, deleteSpecailizationController);

router.get(`/getList`, gettingListSpecailizationController);

export default router;