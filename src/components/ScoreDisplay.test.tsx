import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from './ScoreDisplay';

describe('ScoreDisplay', () => {
    it('should render with score 0', () => {
        render(<ScoreDisplay score={0} />);
        expect(screen.getByText(/Puntuación:/)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should render with positive score', () => {
        render(<ScoreDisplay score={150} />);
        expect(screen.getByText(/Puntuación:/)).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('should display correct format "Puntuación: X"', () => {
        render(<ScoreDisplay score={42} />);
        const element = screen.getByText(/Puntuación:/);
        expect(element).toBeInTheDocument();
        expect(element.textContent).toContain('Puntuación:');
        expect(element.textContent).toContain('42');
    });

    it('should render trophy icon', () => {
        const { container } = render(<ScoreDisplay score={100} />);
        // Trophy icon is rendered as SVG from lucide-react
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('should update when score prop changes', () => {
        const { rerender } = render(<ScoreDisplay score={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();

        rerender(<ScoreDisplay score={100} />);
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should handle large scores', () => {
        render(<ScoreDisplay score={99999} />);
        expect(screen.getByText('99999')).toBeInTheDocument();
    });
});
