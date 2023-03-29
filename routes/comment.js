const express = require("express");
const pool = require("../config")
const router = express.Router();

// Get comment
router.get('/:blogId/comments', function (req, res, next) {
});

// Create new comment
router.post('/:blogId/comments', async function (req, res, next) {
    const { comment, like, comment_by_id } = req.body
    const [rows, fields] = await pool.query(`INSERT INTO comments VALUES(?,?,?,?,CURRENT_TIMESTAMP,?)`,
        [null, req.params.blogId, comment, like, , comment_by_id])
    res.json({
        "message": `A new comment is added (ID: ${rows.insertId})`
    })
});
// Update comment
router.put('/comments/:commentId', async function (req, res, next) {
    const { comment, like, comment_date, comment_by_id, blog_id } = req.body
    const [rows, fields] = await pool.query(`UPDATE comments SET comments.comment=?,comments.like=?,comments.comment_date=?,comments.comment_by_id=?,comments.blog_id=? WHERE comments.id=?`,
        [comment, like, comment_date, comment_by_id, blog_id, req.params.commentId])
    res.json({
        "message": `Comment ID ${req.params.commentId} is updated.`,
        "comment": {
            "comment": "edit comment",
            "like": 0,
            "comment_date": "2021-12-31",
            "comment_by_id": null,
            "blog_id": 1
        }
    })
});

// Delete comment
router.delete('/comments/:commentId', async function (req, res, next) {
    const [rows, fields] = await pool.query(`DELETE FROM comments WHERE id=?`,
        [req.params.commentId])
    res.json({
        "message": `Comment ID ${req.params.commentId} is deleted.`
    })
});

// addlike comment
router.put('/comments/addlike/:commentId', async function (req, res, next) {
    const [rows, fields] = await pool.query("SELECT * FROM comments WHERE id=?", [
        req.params.commentId,
    ]);
    if (rows.length!=0){
        let likeNum = rows[0].like
        let blog = rows[0].blog_id
        likeNum += 1

        //Update จำนวน Like กลับเข้าไปใน DB
        const [rows2, fields2] = await pool.query("UPDATE comments SET comments.like=? WHERE comments.id=?",
        [likeNum, req.params.commentId]);

            res.json({
                "blogId": blog,
                "commentId": req.params.commentId,
                "likeNum": likeNum
            })
        }
    else{
        res.send("ไม่มีข้อมูล")
    }
});


exports.router = router