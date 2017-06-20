import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentList from '../components/CommentList.js'
import { initComments, deleteComment} from '../reducers/comments.js'
import {connect} from 'react-redux'

class CommentListContainer extends Component {
    static propTypes = {
        comments: PropTypes.array,
        initComments: PropTypes.func,
        deleteComment: PropTypes.func
    }

    componentWillMount() {
        this._loadComments()
    }

    _loadComments() {
        let comments = localStorage.getItem('comments')
        comments = comments ? JSON.parse(comments) : []
        this.props.initComments(comments)
    }

    handleDeleteComment(index) {
        const {comments} = this.props
        const newComments = [
            ...comments.slice(0, index),
            ...comments.slice(index + 1)
        ]
        localStorage.setItem('comments', JSON.stringify(newComments))
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    render() {
        return (
            <CommentList 
                comments = {this.props.comments}
                onDeleteComment={this.handleDeleteComment.bind(this)}
            />
        )
    }
}

// 评论列表从 state.comments 中获取
const mapStateToProps = state => {
    return {
        comments: state.comments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // 提供给 CommentListContainer
        // 当从 LocalStorage 加载评论列表以后就会通过这个方法
        // 把评论列表初始化到 state 当中
        initComments: (comments) => {
            dispatch(initComments(comments))
        } ,
        // 删除评论
        onDeleteComment: (commentIndex) => {
            dispatch(deleteComment(commentIndex))
        }
    }
}

// 将 CommentListContainer connect 到 store
// 会把 comments、initComments、onDeleteComment 传给 CommentListContainer
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentListContainer)
