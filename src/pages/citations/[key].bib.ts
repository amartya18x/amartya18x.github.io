import { publications, citationText } from '../../lib/publications';

export function getStaticPaths() {
  return publications.map((entry) => ({ params: { key: entry.key }, props: { entry } }));
}

export function GET({ props }) {
  return new Response(citationText(props.entry), {
    headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
  });
}
