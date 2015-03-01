
var converter = new Showdown.converter();

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h4", {className: "commentAuthor"}, this.props.author), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}}), 
        React.createElement("hr", null)
      )
    );
  }
});

var CommentBox = React.createClass({displayName: "CommentBox",
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement(CommentList, {data: this.state.data}), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }
});

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        React.createElement(Comment, {author: comment.author, key: index}, 
          comment.text
        )
      );
    });
    return (
      React.createElement("div", {className: "commentList"}, 
        commentNodes
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    var btn_classes = "btn btn-primary",
        label_classes = "col-xs-3 col-sm-2 col-md-1 col-lg-1",
        input_classes = "col-xs-9 col-sm-10 col-md-11 col-lg-11";

    return (
      React.createElement("form", {className: "commentForm form-horizontal", onSubmit: this.handleSubmit}, 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {for: "author", className: label_classes}, "Name"), 
          React.createElement("div", {className: input_classes}, 
            React.createElement("input", {type: "text", className: "form-control", id: "author", placeholder: "Your name", ref: "author"})
          )
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {for: "comment", className: label_classes}, "Comment"), 
          React.createElement("div", {className: input_classes}, 
            React.createElement("textarea", {className: "form-control", id: "commnet", placeholder: "Say something...", ref: "text"})
          )
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
            React.createElement("button", {type: "submit", className: btn_classes}, "Post")
          )
        )
      )
    );
  }
});

React.render(
  React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
  document.getElementById('content')
);
