import { vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Footer from './container/Footer/Footer';
import Resume from './pages/Resume/Resume';
import Navbar from './components/Navbar/Navbar';
import Work from './container/Work/Work';
import { client } from './client';

vi.mock('./wrapper', () => ({
  AppWrap: (Component) => Component,
  MotionWrap: (Component) => Component,
}));
vi.mock('./client', () => ({ client: { fetch: vi.fn() }, urlFor: vi.fn() }));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/', hash: '' }),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
});

test('resume resolves and displays downloadable PDF', async () => {
  client.fetch.mockResolvedValue({
    fullName: 'Nahom',
    resumePdf: { asset: { url: 'https://cdn.sanity.io/resume.pdf' } },
  });
  render(<Resume />);
  expect(
    await screen.findByRole('link', { name: 'Download PDF' }),
  ).toHaveAttribute('href', 'https://cdn.sanity.io/resume.pdf');
  expect(client.fetch.mock.calls[0][0]).toContain('asset->{url}');
});

test('mobile menu supports keyboard focus, wrapping, and Escape', () => {
  render(<Navbar />);
  const open = screen.getByRole('button', { name: 'Open navigation' });
  fireEvent.click(open);
  const close = screen.getByRole('button', { name: 'Close navigation' });
  expect(close).toHaveFocus();
  expect(open).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(
    screen.getByRole('dialog').querySelector('li:last-child a'),
  ).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(open).toHaveFocus();
});

test('contact form submits and confirms only successful responses', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true });
  render(<Footer />);
  expect(screen.getByRole('link', { name: '+12405362523' })).toHaveAttribute(
    'href',
    'tel:+12405362523',
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), {
    target: { value: 'Test' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Your email' }), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Your message' }), {
    target: { value: 'A sufficiently long message to send.' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Thank you');
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/contact',
    expect.objectContaining({ method: 'POST' }),
  );
});

test('contact failure keeps user input and announces the error', async () => {
  global.fetch = vi
    .fn()
    .mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ message: 'Too many messages.' }),
    });
  render(<Footer />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), {
    target: { value: 'Test' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Your email' }), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Your message' }), {
    target: { value: 'A sufficiently long message to send.' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Too many messages',
  );
  expect(screen.getByRole('textbox', { name: 'Your name' })).toHaveValue(
    'Test',
  );
});

test('project cards tolerate missing images and link to details', async () => {
  client.fetch.mockResolvedValue([
    {
      _id: '1',
      title: 'My project',
      slug: { current: 'my-project' },
      tags: ['Web'],
    },
  ]);
  render(<Work />);
  expect(
    await screen.findByRole('link', { name: 'View details' }),
  ).toHaveAttribute('href', '/projects/my-project');
  fireEvent.click(screen.getByRole('button', { name: 'AI' }));
  await waitFor(() =>
    expect(
      screen.getByText('No projects in this category yet.'),
    ).toBeInTheDocument(),
  );
});
