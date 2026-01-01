/**
 * Accessibility Tests
 * Tests components for WCAG 2.1 compliance using axe-core
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

// Extend Vitest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

describe('Accessibility Tests', () => {
  describe('UI Components', () => {
    it('Button component should have no accessibility violations', async () => {
      const { Button } = await import('@/components/ui/button')
      const { container } = render(<Button>Click me</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Card component should have no accessibility violations', async () => {
      const { Card, CardHeader, CardTitle, CardContent } = await import('@/components/ui/card')
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>Card content</CardContent>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Input component should have no accessibility violations', async () => {
      const { Input } = await import('@/components/ui/input')
      const { container } = render(
        <div>
          <label htmlFor="test-input">Test Input</label>
          <Input id="test-input" aria-label="Test input field" />
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Dialog component should have no accessibility violations', async () => {
      const { Dialog, DialogTrigger, DialogContent, DialogTitle } = await import('@/components/ui/dialog')
      const { container } = render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Alert component should have no accessibility violations', async () => {
      const { Alert, AlertTitle, AlertDescription } = await import('@/components/ui/alert')
      const { container } = render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Marketing Components', () => {
    it('Logo component should have proper alt text', async () => {
      const { Logo } = await import('@/components/shared/logo')
      const { container } = render(<Logo />)

      const img = container.querySelector('img')
      expect(img).toBeDefined()
      expect(img?.alt).toBeTruthy()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Components', () => {
    it('Label component should be properly associated with inputs', async () => {
      const { Label } = await import('@/components/ui/label')
      const { Input } = await import('@/components/ui/input')
      const { container } = render(
        <div>
          <Label htmlFor="test-field">Test Field</Label>
          <Input id="test-field" />
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Checkbox should have accessible label', async () => {
      const { Checkbox } = await import('@/components/ui/checkbox')
      const { Label } = await import('@/components/ui/label')
      const { container } = render(
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms</Label>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Radio group should have proper ARIA attributes', async () => {
      const { RadioGroup, RadioGroupItem } = await import('@/components/ui/radio-group')
      const { Label } = await import('@/components/ui/label')
      const { container } = render(
        <RadioGroup defaultValue="option1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <Label htmlFor="option1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <Label htmlFor="option2">Option 2</Label>
          </div>
        </RadioGroup>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Select component should be keyboard accessible', async () => {
      const { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } = await import('@/components/ui/select')
      const { container } = render(
        <Select>
          <SelectTrigger aria-label="Select option">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Navigation Components', () => {
    it('Navigation menu should have proper ARIA attributes', async () => {
      const { NavigationMenu, NavigationMenuItem, NavigationMenuList } = await import('@/components/ui/navigation-menu')
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="/">Home</a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/about">About</a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Data Display Components', () => {
    it('Table should have proper headers and caption', async () => {
      const { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } = await import('@/components/ui/table')
      const { container } = render(
        <Table>
          <TableCaption>A list of recent invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Badge component should have accessible text', async () => {
      const { Badge } = await import('@/components/ui/badge')
      const { container } = render(<Badge>New</Badge>)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Feedback Components', () => {
    it('Toast component should announce to screen readers', async () => {
      const { Toaster } = await import('@/components/ui/toaster')
      const { container } = render(<Toaster />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Progress component should have accessible label', async () => {
      const { Progress } = await import('@/components/ui/progress')
      const { container } = render(
        <Progress value={50} aria-label="Upload progress" />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Skeleton component should not interfere with screen readers', async () => {
      const { Skeleton } = await import('@/components/ui/skeleton')
      const { container } = render(
        <div>
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Color Contrast', () => {
    it('Button variants should have sufficient color contrast', async () => {
      const { Button } = await import('@/components/ui/button')
      const { container } = render(
        <div>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
