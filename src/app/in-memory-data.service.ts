import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const caravans = [
      { id: '0', name: 'Caravan 1', location: 'Coastfields', grade: 'Gold',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
      { id: '1', name: 'Caravan 2', location: 'Coastfields', grade: 'Bronze',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
      { id: '2', name: 'Caravan 3', location: 'Coastfields', grade: 'Gold',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
      { id: '3', name: 'Caravan 4', location: 'Coastfields', grade: 'Bronze',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
      { id: '4', name: 'Caravan 5', location: 'Coastfields', grade: 'Silver',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
      { id: '5', name: 'Caravan 6', location: 'Coastfields', grade: 'Silver',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: true },
      { id: '6', name: 'Caravan 7', location: 'Coastfields', grade: 'Silver',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: false, smoking: false },
      { id: '7', name: 'Caravan 8', location: 'Coastfields', grade: 'Gold',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
      { id: '8', name: 'Caravan 9', location: 'Coastfields', grade: 'Gold',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: false, smoking: true },
      { id: '9', name: 'Caravan 10', location: 'Coastfields', grade: 'Bronze',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: false, smoking: false }
    ];
    const customers = [
      { id: 0, firstName: 'Samia', secondName: 'Wickens', email: 'samia.wickens@gmail.com',
        phone: '01020345678', addressLine1: '21 Wickens Street', addressLine2: 'Walton',
        addressLine3: 'Merseyside', postcode: 'L9 3PQ' },
      { id: 1, firstName: 'Oriana', secondName: 'Pickett', email: 'oriana.pickett@gmail.com',
        phone: '01031458765', addressLine1: '16 Pickett Close', addressLine2: 'Aintree',
        addressLine3: 'Merseyside', postcode: 'L9 5AB' }
    ];
    const bookings = [
      { id: 0, caravan: { id: 0, name: 'Caravan 1', location: 'Coastfields', grade: 'Gold',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
        customer: { id: 1, firstName: 'Oriana', secondName: 'Pickett', email: 'oriana.pickett@gmail.com',
        phone: '01031458765', addressLine1: '16 Pickett Close', addressLine2: 'Aintree',
        addressLine3: 'Merseyside', postcode: 'L9 5AB' },
        dateFrom: '2019-04-23T18:25:43.511Z', dateTo: '2019-05-15T18:25:43.511Z',
        price: 279.0, paid: false },
      { id: 1, caravan: { id: 1, name: 'Caravan 2', location: 'Coastfields', grade: 'Bronze',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
        customer: { id: 0, firstName: 'Samia', secondName: 'Wickens', email: 'samia.wickens@gmail.com',
        phone: '01020345678', addressLine1: '21 Wickens Street', addressLine2: 'Walton',
        addressLine3: 'Merseyside', postcode: 'L9 3PQ' },
        dateFrom: '2019-06-05T18:25:43.511Z', dateTo: '2019-06-19T18:25:43.511Z',
        price: 279.0, paid: false },
      { id: 2, caravan: { id: 0, name: 'Caravan 1', location: 'Coastfields', grade: 'Gold',
      summary: 'This is a lovely modern caravan in our Gold range. It has double glazing and some extra heating in bedrooms '
      + 'and is sited on a quieter part of the park.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida blandit magna, tempor dapibus dui.',
      imageRefs: [ 'http://rixsonleisure.co.uk/wp-content/uploads/2009/10/JG45-OUTSIDE-view1.jpg',
      'http://rixsonleisure.co.uk/wp-content/uploads/2013/12/caravan3-loungesml.jpg' ],
      berths: 3, pets: true, smoking: false },
        customer: { id: 0, firstName: 'Samia', secondName: 'Wickens', email: 'samia.wickens@gmail.com',
        phone: '01020345678', addressLine1: '21 Wickens Street', addressLine2: 'Walton',
        addressLine3: 'Merseyside', postcode: 'L9 3PQ' },
        dateFrom: '2019-04-12T18:25:43.511Z', dateTo: '2019-04-23T18:25:43.511Z',
        price: 279.0, paid: false }
    ];
    return {caravans, customers, bookings};
  }
}
