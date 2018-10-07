describe('Index', () => {

    it('usres should be able to view the "/" page', () => {
       cy
           .visit('http://221.167.111.48:39090/')
           .get('h1').contains('All Users');
    });

});