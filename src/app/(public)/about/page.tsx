import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | ChefChatz',
  description: 'Learn more about ChefChatz and our mission.',
}

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-[58rem]">
        <h1 className="mb-6 text-4xl font-bold">About ChefChatz</h1>
        
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            At ChefChatz, we believe that everyone can become a great cook with the right guidance.
            Our AI-powered platform combines cutting-edge technology with culinary expertise to provide
            personalized cooking assistance, making the joy of cooking accessible to all.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">What Sets Us Apart</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xl font-medium">AI-Powered Guidance</h3>
              <p className="text-muted-foreground">
                Our advanced AI understands your cooking style and preferences,
                providing tailored recipes and real-time cooking assistance.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium">Expert Knowledge</h3>
              <p className="text-muted-foreground">
                Built with input from professional chefs, ensuring accurate and
                reliable cooking guidance.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium">Community-Driven</h3>
              <p className="text-muted-foreground">
                Share recipes, tips, and experiences with a community of passionate
                home cooks.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium">Continuous Learning</h3>
              <p className="text-muted-foreground">
                Our AI constantly learns and improves from user interactions,
                making the experience better for everyone.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <p className="text-muted-foreground">
            Have questions or feedback? We&apos;d love to hear from you.
            Reach out to us at{' '}
            <a
              href="mailto:support@chefchatz.com"
              className="text-primary hover:underline"
            >
              support@chefchatz.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
