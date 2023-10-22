import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('test that form calls correct handler with correct details when new blog created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog}/>)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const createButton = container.querySelector('#create-button')

  await user.type(titleInput, 'this is the title')
  await user.type(authorInput, 'this is the author')
  await user.type(urlInput, 'this is the url')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('this is the title')
  expect(createBlog.mock.calls[0][0].author).toBe('this is the author')
  expect(createBlog.mock.calls[0][0].url).toBe('this is the url')
})