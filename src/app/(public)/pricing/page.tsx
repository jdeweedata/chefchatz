import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Pricing | ChefChatz',
  description: 'Simple, transparent pricing for everyone.',
}

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out ChefChatz',
    price: '$0',
    features: [
      '5 recipes per month',
      'Basic AI chat assistance',
      'Community recipes access',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    description: 'For serious home chefs',
    price: '$9.99',
    features: [
      'Unlimited recipes',
      'Advanced AI cooking guidance',
      'Custom recipe collections',
      'Priority support',
      'Recipe sharing',
    ],
  },
  {
    name: 'Chef',
    description: 'For professional chefs and restaurants',
    price: '$29.99',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Training sessions',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-10">
      <div className="mx-auto mb-10 max-w-[58rem] text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Choose the perfect plan for your cooking journey
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{plan.name === 'Free' ? 'Get Started' : 'Subscribe'}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
