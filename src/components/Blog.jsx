import { useState } from 'react'

const Blog = ({ blog, user, addLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [fullDetails, setFullDetails] = useState(false)

  const showDeleteButton = () => {
    if (blog.user.username === user.username) {
      return <button id ='remove' onClick={removeBlog}> remove </button>
    }
  }
  const showFullDetails = () => {
    return (
      <div>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}
          <button id ='like' onClick={addLike}> like </button>
        </p>
        <p>{showDeleteButton()}</p>
        <p>{blog.user.username}</p>
      </div>
    )
  }


  const toggleView = () => {
    setFullDetails(!fullDetails)
  }

  return (
    <div className="blog-list">
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button id ='hide-view' onClick={toggleView}>
          {fullDetails ? 'hide' : 'view'}
        </button>
        {fullDetails && showFullDetails()}
      </div>
    </div>
  )
}

export default Blog