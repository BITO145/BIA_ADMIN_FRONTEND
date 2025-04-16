export const users = [
    {
      id: '1',
      email: 'superadmin@example.com',
      username: 'superadmin',
      password: 'admin123',
      role: 'super_admin',
    },
  ];
  
  export const events = [
    {
      id: '1',
      name: 'Annual Tech Conference',
      date: '2024-06-15',
      time: '09:00',
      location: 'Convention Center',
      description:
        'Join us for our annual technology conference featuring industry experts and networking opportunities.',
      membershipRequired: true,
      chapterId: '1',
    },
  ];
  
  export const chapters = [
    {
      id: '1',
      name: 'Tech Innovators',
      zone: 'North',
      description: 'A chapter dedicated to technological innovation and advancement.',
      leadName: 'John Doe',
      members: [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'committee',
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'general',
        },
      ],
    },
  ];
  