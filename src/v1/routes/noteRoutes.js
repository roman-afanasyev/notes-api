const express = require('express');
const apicache = require('apicache');

const {
  getAllNotes,
  getOneNote,
  deleteOneNote,
  updateOneNote,
  createNewNote
}  = require('../controllers/noteController');

const router = express.Router();
const cache = apicache.middleware;

/**
 * @openapi
 * /api/v1/notes:
 *   get:
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of a note
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Pagination limit
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Note"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 *   post:
 *     tags:
 *       - Notes
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Test name
 *             content:
 *               type: string
 *               example: Test note content 123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: "#/components/schemas/Note"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 * /api/v1/notes/{noteId}:
 *   get:
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         description: The id of a note
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: "#/components/schemas/Note"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */

router.get('/', cache('2 minutes'), getAllNotes);

router.get('/:noteId', getOneNote);

router.post('/', createNewNote);

router.patch('/:noteId', updateOneNote);

router.delete('/:noteId', deleteOneNote);

module.exports = router;