import express from "express";
import {
  all_createdSchools,
  createSchoolAccount,
  createSchoolProfile,
  loginSchoolAccount,
  resetSchoolAccountPassword,
} from "../models-controllers/school/school.controller";
import cacheSuccesses from "../services/apicache";
const router = express.Router();

/**
 * @swagger
 *  /create_school/:
 *   post:
 *       summary: Creat School Account Endpoint
 *       tags: [School]
 *       responses:
 *          201:
 *            description: Account created successfully
 *            content:
 *              application/json:
 *                 schema:
 *                    $ref: '#/components/schemas/creatAccountSuccess'
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/CreateSchoolSchema'
 */

router.post("/create_school/", createSchoolAccount);

/**
 * @swagger
 *  /complete_school_profile/:
 *   patch:
 *       summary: Complete School Profile Endpoint
 *       tags: [School]
 *       responses:
 *          201:
 *            description: Account created successfully
 *            content:
 *              application/json:
 *                 schema:
 *                    $ref: '#/components/schemas/UpdatedAccountSuccess'
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/School'
 */

router.patch("/complete_school_profile/", createSchoolProfile);
/**
 * @swagger
 * /login_school/:
 *  post:
 *    summary: login a school admin
 *    tags: [School]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginSchema'
 *    responses:
 *      200:
 *        description: Login json response.
 *        content:
 *          application/json:
 *            schema:
 *            $ref: '#/components/schemas/LoginSuccess'
 *
 */

router.post("/login_school/", loginSchoolAccount);
/**
 * @swagger
 * /reset_school_password/:
 *  patch:
 *    summary: reset password with school email
 *    tags: [School]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EmailSchema'
 *    responses:
 *      200:
 *        description: School password sent.
 *        content:
 *          application/json:
 *            schema:
 *            $ref: '#/components/schemas/School'
 *
 */

router.patch("/reset_school_password/", resetSchoolAccountPassword);

/**
 * @swagger
 * /all_schools/:
 *  get:
 *    summary: Returns a list of tasks
 *    tags: [School]
 *    responses:
 *      200:
 *        description: the list of tasks
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/School'
 */

router.get("/all_schools/", cacheSuccesses, all_createdSchools);

/**
 * @swagger
 * components:
 *  schemas:
 *   LoginSchema:
 *      type: object
 *      required:
 *         - school_email
 *         - admin_password
 *      properties:
 *       school_email:
 *         type: string
 *         description: Provide school email address.
 *       admin_password:
 *         type: string
 *         description: Provide school admin password.
 *      example:
 *         school_email: school@gmail.com
 *         admin_password: 12345678
 *   LoginSuccess:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: token message
 *        school:
 *          type: object
 *          description: jkh
 *      example:
 *        message: ayo@mail.com
 *        school_credentials:
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..XXXXX
 *           school_id: 6346fd6004f85776d34b3bf6
 *   creatAccountSuccess:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: token message
 *        school:
 *          type: object
 *          description: jkh
 *      example:
 *        message: Account created successfully
 *   EmailSchema:
 *      type: object
 *      required:
 *         - school_email
 *      properties:
 *       school_email:
 *         type: string
 *         description: The school email.
 *      example:
 *         school_email: ayo@gmail.com
 *   CreateSchoolSchema:
 *      type: object
 *      required:
 *         - school_email
 *         - admin_password
 *      properties:
 *       school_email:
 *         type: string
 *         description: The school email.
 *       admin_password:
 *         type: string
 *         description: The school admin password
 *      example:
 *         school_email: ayo@gmail.com
 *         admin_password: ayomiku445
 *   UpdatedAccountSuccess:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: token message
 *        school:
 *          type: object
 *          description: jkh
 *      example:
 *        message: Account updated successfully
 *   School:
 *     type: object
 *     required:
 *      - school_name
 *      - school_adress
 *      - rc_number
 *      - school_logo
 *      - admin_firstname
 *      - admin_lastname
 *      - admin_position
 *      - profile_completed
 *     properties:
 *      _id:
 *        type: string
 *        description: The auto-generated id of the School.
 *      school_name:
 *        type: string
 *        description: The name of school.
 *      school_adress:
 *        type: string
 *        description: The school location or address.
 *      rc_number:
 *        type: integer
 *        description: The rc number.
 *      school_logo:
 *        type: string
 *        description: The school logo in (jpg, jpeg, png) format.
 *      admin_firstname:
 *        type: number
 *        description: School admin firstname.
 *      admin_lastname:
 *        type: string
 *        description: School  admin lastname.
 *      admin_position:
 *        type: string
 *        description: The admin position.
 *      profile_completed:
 *        type:boolean
 *         description:If admin completed profile
 *      createdAt:
 *        type: string
 *        format: date
 *        description: The date of the record creation.
 *      updatedAt:
 *        type: string
 *        format: date
 *        description: The date school data is updated.
 *     example:
 *          _id: autogeneratedhashvalue
 *          school_name: school_name
 *          school_adress: school_adress
 *          rc_number: 1234
 *          school_logo: school_logo
 *          admin_firstname: admin_firstname
 *          admin_lastname: admin_lastname
 *          school_email: ayo@gmail.com
 *          admin_position: admin_position
 *          admin_password: ayomiku123456
 *          profile_completed: false
 *          createdAt: date in date format
 *          updatedAt: date in date format
 */
export default router;
