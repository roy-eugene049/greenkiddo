import { BlogPost, BlogCategory } from '../types/blog';

// Mock Blog Posts - Sustainability focused
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Simple Ways Kids Can Help Save the Planet',
    slug: '10-simple-ways-kids-can-help-save-the-planet',
    excerpt: 'Discover easy and fun activities that children can do every day to make a positive impact on our environment.',
    content: `# 10 Simple Ways Kids Can Help Save the Planet

Our planet needs heroes, and kids can be some of the most powerful ones! Here are 10 simple, fun ways children can help protect the environment:

## 1. Turn Off Lights and Electronics
When you leave a room, turn off the lights. Unplug chargers when they're not in use. This saves energy and helps reduce carbon emissions.

## 2. Use Reusable Water Bottles
Instead of plastic bottles, use a reusable water bottle. This reduces plastic waste that harms our oceans and wildlife.

## 3. Walk or Bike to School
If it's safe, walk or bike instead of driving. This reduces air pollution and is great exercise!

## 4. Plant a Tree or Garden
Trees absorb carbon dioxide and give us oxygen. Starting a small garden teaches kids about nature and sustainability.

## 5. Reduce, Reuse, Recycle
Learn what can be recycled in your area. Reuse items when possible. Buy less stuff you don't need.

## 6. Save Water
Turn off the tap while brushing teeth. Take shorter showers. Every drop counts!

## 7. Use Both Sides of Paper
Before recycling, make sure you've used both sides of paper for drawing and writing.

## 8. Start a Compost Bin
Food scraps can become rich soil for gardens. Composting reduces waste and helps plants grow.

## 9. Choose Sustainable Products
Look for products made from recycled materials. Support companies that care about the environment.

## 10. Spread the Word
Share what you learn about sustainability with friends and family. Together, we can make a big difference!

Remember, every small action counts. You're never too young to be an environmental hero!`,
    author: {
      id: 'author-1',
      name: 'Dr. Sarah Green',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      bio: 'Environmental educator and sustainability advocate'
    },
    category: 'Tips',
    tags: ['sustainability', 'kids', 'environment', 'tips'],
    featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
    publishedAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    readTime: 5,
    views: 1250,
    likes: 89
  },
  {
    id: '2',
    title: 'Understanding Your Carbon Footprint: A Guide for Families',
    slug: 'understanding-your-carbon-footprint-guide-for-families',
    excerpt: 'Learn what a carbon footprint is and how families can work together to reduce their environmental impact.',
    content: `# Understanding Your Carbon Footprint

A carbon footprint is the total amount of greenhouse gases produced by our daily activities. Understanding it is the first step to reducing our impact on the planet.

## What Creates a Carbon Footprint?

- Transportation (cars, planes)
- Energy use at home
- Food choices
- Shopping habits
- Waste production

## How Families Can Reduce Their Footprint

1. **Choose Sustainable Transportation**: Walk, bike, or use public transport when possible
2. **Energy Efficient Homes**: Use LED bulbs, unplug devices, adjust thermostats
3. **Eat Locally**: Support local farmers and reduce food miles
4. **Reduce Waste**: Compost, recycle, buy less
5. **Conserve Water**: Fix leaks, use efficient appliances

Every family can make a difference!`,
    author: {
      id: 'author-2',
      name: 'Prof. Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      bio: 'Climate scientist and renewable energy expert'
    },
    category: 'Education',
    tags: ['carbon-footprint', 'climate', 'family', 'education'],
    featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
    publishedAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    readTime: 8,
    views: 890,
    likes: 67
  },
  {
    id: '3',
    title: 'The Digital World and Climate Change: What Kids Need to Know',
    slug: 'digital-world-climate-change-what-kids-need-to-know',
    excerpt: 'Explore how our digital activities affect the environment and learn ways to use technology responsibly.',
    content: `# The Digital World and Climate Change

Technology is amazing, but it also has an environmental impact. Let's learn how to use it wisely!

## How Digital Activities Affect the Planet

- **Data Centers**: Store all our online information and use lots of energy
- **Device Manufacturing**: Making phones and computers uses resources
- **E-Waste**: Old devices create electronic waste
- **Cloud Storage**: Storing files online uses energy

## What Kids Can Do

1. **Use Devices Longer**: Don't upgrade just because something new exists
2. **Delete Unused Files**: Free up cloud storage
3. **Stream Responsibly**: Lower video quality when possible
4. **Recycle Old Devices**: Don't throw electronics in the trash
5. **Unplug Chargers**: When not in use

Technology can help us learn about sustainability too! Use it wisely.`,
    author: {
      id: 'author-3',
      name: 'Dr. James Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
      bio: 'Tech sustainability researcher'
    },
    category: 'Technology',
    tags: ['technology', 'digital', 'climate', 'kids'],
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    publishedAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    readTime: 6,
    views: 1200,
    likes: 92
  },
  {
    id: '4',
    title: 'Recycling Made Fun: A Family Activity Guide',
    slug: 'recycling-made-fun-family-activity-guide',
    excerpt: 'Turn recycling into a fun family activity with these creative ideas and games.',
    content: `# Recycling Made Fun

Recycling doesn't have to be boring! Here are fun ways to make it a family activity.

## Creative Recycling Projects

1. **Art from Trash**: Create art projects using recyclable materials
2. **Recycling Race**: See who can sort items fastest
3. **Upcycling Challenge**: Turn old items into something new
4. **Compost Science**: Learn about decomposition with a compost bin
5. **Recycling Bingo**: Make a game of finding recyclable items

## Educational Activities

- Visit a recycling center
- Learn about different materials
- Track your family's recycling
- Set recycling goals

Make sustainability fun for the whole family!`,
    author: {
      id: 'author-4',
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      bio: 'Zero-waste advocate and educator'
    },
    category: 'Activities',
    tags: ['recycling', 'family', 'activities', 'fun'],
    featuredImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop',
    publishedAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    readTime: 7,
    views: 980,
    likes: 74
  }
];

export const mockCategories: BlogCategory[] = [
  { id: '1', name: 'Tips', slug: 'tips', description: 'Practical sustainability tips', postCount: 1 },
  { id: '2', name: 'Education', slug: 'education', description: 'Learning about sustainability', postCount: 1 },
  { id: '3', name: 'Technology', slug: 'technology', description: 'Tech and environment', postCount: 1 },
  { id: '4', name: 'Activities', slug: 'activities', description: 'Fun family activities', postCount: 1 }
];

export class BlogService {
  static async getAllPosts(): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBlogPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlogPosts.find(post => post.slug === slug) || null;
  }

  static async getPostsByCategory(category: string): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBlogPosts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  static async getCategories(): Promise<BlogCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  }

  static async searchPosts(query: string): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return mockBlogPosts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

