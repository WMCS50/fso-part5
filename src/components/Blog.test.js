import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

//basic blog and mock setups for tests below
const blog = {
  title: 'Title should render',
  author: 'Author should render',
  url: 'Will url render',
  user: {
    username: 'someone',
    id: '1a2b3c4d5e6f'
  },
  likes: 1000
}

const mockHandler = jest.fn()

const mockUser = {
  username: 'someone',
  id: '1a2b3c4d5e6f'
}

test('renders title and author not url or likes', () => {
  const { container } = render(<Blog blog={blog} />)

  expect(container).toHaveTextContent('Title should render')
  expect(container).toHaveTextContent('Author should render')
  expect(container).not.toHaveTextContent('Will url render')
  expect(container).not.toHaveTextContent(1000)
})

test('renders url and likes when view details button is clicked', async () => {
  const { container } = render(
    <Blog
      blog={blog}
      user={mockUser}
      addLike={mockHandler}
      removeBlog={mockHandler}
    />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(container).toHaveTextContent('Will url render')
  expect(container).toHaveTextContent(1000)

})

test('tests like button clicked twice, then handler called twice', async () => {
  const { container } = render(
    <Blog
      blog={blog}
      user={mockUser}
      addLike={mockHandler}
      removeBlog={mockHandler}
    />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})
