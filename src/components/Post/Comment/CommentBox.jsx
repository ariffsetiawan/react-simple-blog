import React from 'react';

class CommentBox extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            comments: null,
            authorName: '',
            comment: '',
            reply: '',
            commentIdToReplyTo: null,
            contractedComments: {},
        };

        this.comment = this.comment.bind(this);
        this.reply = this.reply.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.load = this.load.bind(this);

        this.onUpVote = this.onUpVote.bind(this);
        this.onDownVote = this.onDownVote.bind(this);
        this.onToggleContract = this.onToggleContract.bind(this);
        this.onShowReply = this.onShowReply.bind(this);
        this.onHideReply = this.onHideReply.bind(this);
        this.onComment = this.onComment.bind(this);
        this.onReply = this.onReply.bind(this);
        this.renderComment = this.renderComment.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onChangeReply = this.onChangeReply.bind(this);
        this.onChangeAuthorName = this.onChangeAuthorName.bind(this);

    }

    componentDidMount() {

        this.load();
    }

    comment() {

        return this.props.comment(this.state.comment, null, this.state.authorName)
            .then(this.clearInput)
            .then(this.load);
    }

    reply() {

        return this.props.comment(this.state.reply, this.state.commentIdToReplyTo)
            .then(this.clearInput)
            .then(this.load);
    }

    clearInput() {

        return this.setState({
            authorName: '',
            comment: '',
            reply: '',
            commentIdToReplyTo: null
        });
    }

    load() {

        return this.props.getComments().then(comments => {

            this.setState({ comments });

            return comments;
        });
    }

    onUpVote(e) {

        this.props.upVote(e.currentTarget.value);
    }

    onDownVote(e) {

        this.props.downVote(e.currentTarget.value);
    }

    onToggleContract(e) {

        const commentId = e.currentTarget.value;

        this.setState({
            contractedComments: Object.assign({}, this.state.contractedComments, {
                [commentId]: !this.state.contractedComments[commentId]
            })
        })
    }

    onShowReply(e) {

        const reply = this.state.commentIdToReplyTo !== e.currentTarget.value ? '' : this.state.reply;

        this.setState({
            reply,
            commentIdToReplyTo: e.currentTarget.value
        });
    }

    onHideReply(e) {

        this.setState({
            reply: '',
            commentIdToReplyTo: null
        });
    }

    onComment(e) {
        
        e.preventDefault();

        this.comment();
    }

    onReply(e) {

        e.preventDefault();

        this.reply();
    }

    onChangeAuthorName(e) {

        this.setState({
            authorName: e.currentTarget.value,
            avatar: "https://ui-avatars.com/api/name="+e.currentTarget.value.replace(/\s+$/, '')+"&background=random"
        });
    }

    onChangeComment(e) {

        this.setState({
            comment: e.currentTarget.value
        });
    }

    onChangeReply(e) {

        this.setState({
            reply: e.currentTarget.value
        });
    }

    renderComment(comment) {

        const classNames = ['comment shadow-sm'];

        if (this.state.commentIdToReplyTo === comment.id) {
            classNames.push('replying-to');
        }
        if (comment.belongsToAuthor) {
            classNames.push('belongs-to-author');
        }

        if (comment.className) {
            classNames.push(comment.className);
        }


        return (
            <div className={classNames.map(className => this.prefix(className)).join(' ')}>
                <div
                    className={this.prefix(`level-${comment.level}`)}
                >
                    <div className={this.prefix('comment-content')}>
                        <div className={this.prefix('comment-header')}>
                        <div className="pure-g">
                        {  
                            <img
                                className={'pure-u-1-5 '+this.prefix('user-avatar')}
                                src={comment.userAvatarUrl}
                                alt={comment.userNameDisplay}
                            />          
                        }
                        
                            <span className={'pure-u-4-5 '+this.prefix('user-name')}><span className="username-display">{comment.userNameDisplay}</span> <br/> <span className="timestamp-display">{comment.timestampDisplay}</span></span>
                        </div>
                        </div>
                        <div className={this.prefix('comment-body')}>
                            {comment.bodyDisplay}
                        </div>
                        <div className={this.prefix('comment-footer')}>
                            {
                                (this.state.commentIdToReplyTo === comment.id) ?
                                    (
                                        <button
                                            className={'pure-button pure-button-secondary '+this.prefix('hide-reply')}
                                            value={comment.id}
                                            onClick={this.onHideReply}
                                        >
                                            {this.props.hideReplyButtonContent}
                                        </button>

                                    ) : (
                                        <button
                                            className={'button-reply '+this.prefix('show-reply')}
                                            value={comment.id}
                                            onClick={this.onShowReply}
                                        >
                                            {this.props.showReplyButtonContent}
                                        </button>
                                    )
                            }

                        </div>
                    </div>
                    <div className={this.prefix('reply')}>
                        {
                            (this.state.commentIdToReplyTo === comment.id) ?
                                (
                                    <div className={this.prefix('form-wrapper')}>
                                        <form className={'pure-form pure-form-stacked '+this.prefix('reply-form')} onSubmit={this.onReply}>
                                            <div className={this.prefix('form-element')}>
                                                <textarea
                                                    name="reply"
                                                    className="pure-input-1 content"
                                                    rows={this.props.textareaRows}
                                                    value={this.state.reply}
                                                    onChange={this.onChangeReply}
                                                    disabled={this.props.disabled}
                                                />
                                            </div>
                                            <div>
                                                {
                                                    (!this.props.disabled) ?
                                                        (
                                                            <button type="submit" className="pure-button pure-button-primary">{this.props.postReplyButtonContent}</button>
                                                        ) : null
                                                }
                                                {
                                                    (!this.props.disabled) ? this.props.postButtonExtraContent : null
                                                }
                                            </div>
                                        </form>
                                        {this.props.disabled ? (
                                            <this.props.disabledComponent {...this.props} />
                                        ) : null}
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderComments(comments) {

        return comments.map(comment => {

            return (
                <li key={comment.id} className={this.prefix('comment-and-replies')}>
                    {this.renderComment(comment)}
                    <ul
                        className={this.prefix('replies')}
                        style={{paddingLeft: this.props.levelPadding}}
                    >
                        {this.state.contractedComments[comment.id] ? null : this.renderComments(comment.replies)}
                    </ul>
                </li>
            );
        });
    }

    get renderedComments() {

        if (!this.state.comments) {
            return (
                <li className={this.prefix('loading')}>
                    {this.props.loadingContent}
                </li>
            );
        }

        const comments = [];
        const references = {};

        this.state.comments.forEach(comment => {

            const {
                id,
                votes,
                bodyDisplay,
                userAvatarUrl,
                userNameDisplay,
                timestampDisplay,
                belongsToAuthor,
                parentCommentId,
                className
            } = this.props.normalizeComment(comment);


            references[id] = {
                id,
                votes,
                bodyDisplay,
                userAvatarUrl,
                userNameDisplay,
                timestampDisplay,
                belongsToAuthor,
                replies: [],
                level: 0,
                className
            };

            if (parentCommentId) {
                references[parentCommentId].replies.push(references[id]);
                references[id].level = references[parentCommentId].level + 1;
            } else {
                comments.push(references[id]);
            }
        });

        return this.renderComments(comments);
    }

    prefix(className) {

        return `${this.props.classPrefix}${className}`;
    }

    render() {

        return (
            <div className={this.props.className}>
                <div className={this.prefix('header')}>
                    <div className="pure-g">
                        <div className="pure-u-1 shadow-sm">
                        <form className="pure-form pure-form-stacked" onSubmit={this.onComment}>
                            <fieldset>
                            <h2>Add a Comment</h2>
                            <input type="text" name="authorName" className="pure-input-1 title" placeholder="Name" required="" value={ this.state.authorName } onChange={ this.onChangeAuthorName } />
                            <textarea name="comment" className="pure-input-1 content" placeholder="Comment" required="" rows="5" value={ this.state.comment} onChange={ this.onChangeComment }></textarea>
                            <button type="submit" className="pure-button pure-button-primary">Submit</button>
                            </fieldset>
                        </form>
                        </div>
                    </div>
                </div>
                <div className={this.prefix('body')}>
                    <ul className={this.prefix('comments')}>
                        {this.renderedComments}
                    </ul>
                </div>
            </div>
        );
    }


    static upVote(commentId) {

    }

    static downVote(commentId) {

    }

    static getComments() {

        return new Promise();
    }

    static normalizeComment(comment) {

        return comment;
    }

    static comment(body, parentCommentId = null) {

        return new Promise();
    }

    static disabledComponent(props) {

        return (
            <div>
                Replace with a component that logs in your user or gets their name.
            </div>
        );
    }

    static get defaultProps() {

        const {
            upVote,
            downVote,
            getComments,
            normalizeComment,
            comment,
            disabledComponent
        } = this;

        return {
            classPrefix: 'cb-',
            className: 'commentbox',
            disabled: true,
            usersHaveAvatars: false,
            levelPadding: 25,
            textareaRows: 7,
            loadingContent: 'Loading...',
            expandButtonContent: '[+]',
            contractButtonContent: '[-]',
            showReplyButtonContent: 'Reply',
            hideReplyButtonContent: 'Cancel',
            postReplyButtonContent: 'Post Reply',
            postCommentButtonContent: 'Post Comment',
            postButtonExtraContent: null,
            disabledComponent,
            upVote,
            downVote,
            getComments,
            normalizeComment,
            comment
        };
    }
}

export default CommentBox;