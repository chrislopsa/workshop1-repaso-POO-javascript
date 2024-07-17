
class User{
    constructor(id, name, email, password){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    makeBooking(userId, book, departure, arrival){
        const bookingsManager = new BookingsManager();
        bookingsManager.addBooking(userId, departure, arrival);
    }
}

class RegularUser extends User{
    constructor(id, name, email, password) {
        super(id, name, email, password); 
    }
}

class AdminUser extends User{
    constructor(id, name, email, password) {
        super(id, name, email, password); 
    }
    updateBooking(id, departure, arrival){
        const bookingsManager = new BookingsManager();
        bookingsManager.updateBooking(id, departure, arrival);
    }
    deleteBooking(id){
        const bookingsManager = new BookingsManager();
        bookingsManager.deleteBooking(id);
    }
}
class Auth{
    static login(user){
        const token = Auth.generateToken();
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(user));
    }
    static logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    static generateToken(){
        return Math.random().toString(36).substring(2);
    }
}

class Booking{
    constructor(id, userId, departure, arrival){
        this.id = id;
        this.userId = userId;
        this.departure = departure; 
        this.arrival = arrival;    
    }
}

class BookingsManager{
    constructor(){
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        console.log('bookings:',this.bookings);
        this.loadBookings();
    }
    addBooking(userId, departure, arrival){
        
        const id = this.bookings.length ? this.bookings[this.bookings.length - 1].id + 1 : 1;
        const booking = new Booking(id, userId, departure, arrival);
        console.log('booking',booking);
        this.bookings.push(booking);
        this.saveBookings();
        this.renderBookings();
    }
    deleteBooking(id) {
        //modify the 'Booking' attribute by filtering it by those that do not correspond to the 'ID' we want to delete
        this.bookings = this.bookings.filter(booking => booking.id !== id);
        //store the information in localStorage
        this.saveBookings();
        //rendering the information on the screen
        this.renderBookings();
    }
    updateBooking(id, departure, arrival) {
        const booking = this.bookings.find(booking => booking.id === id);
        booking.departure = departure; 
        booking.arrival = arrival;
        this.saveBookings();
        this.renderBookings();
    }
    saveBookings() {
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
    }
    //
    loadBookings() {
        this.renderBookings();
    }
    //Method for Rendering the Entire Task List
    renderBookings() {
        const $bookingsList = document.getElementById('bookings-list');

        $bookingsList.innerHTML="";

        this.bookings.forEach(booking => {
            
            const $booking = document.createElement('li');
            const $deleteButton = document.createElement('button');
            const $updateButton = document.createElement('button');
            
            $bookingDeparture.textContent = booking.departure;
            $deleteButton.textContent = 'Eliminar';
            $updateButton.textContent = 'Cambiar fecha';

            $deleteButton.addEventListener('click',(e)=>{
                e.stopPropagation();
                this.deleteBooking(booking.id);
            })

            $updateButton.addEventListener('click',(e)=>{
                e.stopPropagation();

                const $imputNewDate = document.createElement('input');
                const $sendNewDate = document.createElement('button');

                $book.append($imputNewDate, $sendNewDate);
                $sendNewDate.textContent = 'Actualizar';

                $sendNewDate.addEventListener('click',()=>{
                    this.updateBooking(booking.id, $imputNewDate.value);
                })
            })

            $book.append($deleteButton, $updateButton);
            $bookingsList.appendChild($book);

        });
    }
}
document.addEventListener('DOMContentLoaded', () => {

    const adminToken = 'AdminRiwi';
    const userId = 1;
    const bookingsManager = new BookingsManager();

    const $container = document.getElementById('container');
    $container.innerHTML = `
        <form id="login-form" class="login-form">
            <label for="name">Nombre</label>
            <input id="name" name="name" type="text" maxlength="40">
            <label for="email">Correo Electrónico</label>
            <input id="email" name="email" type="text" maxlength="50">
            <label for="password">Contraseña</label>
            <input id="password" name="password" type="text" maxlength="10">
            <button id="login-btn" class="login-btn">Login</button>
            <label>
                Soy Administrador 
                <input type="checkbox" id='checkAdmin'>
            </label><br>
        </form>
        `;


    document.getElementById('login-btn').addEventListener('click',(e)=>{
        e.stopPropagation();
        e.preventDefault();


        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const checkAdmin = document.getElementById('checkAdmin').checked;

        if (name && email && password && checkAdmin){

            const $adminPassword = document.createElement('input');
            const $label = document.createElement('label');
            
            $label.textContent = 'digita contraseña de admin y presiona login de nuevo:';
            $container.append($label, $adminPassword);
             

            document.getElementById('login-btn').addEventListener('click',(e)=>{
                e.stopPropagation();
                e.preventDefault();

                const adminPassword = $adminPassword.value;

                if(adminPassword === adminToken){
                    const user = new AdminUser(userId, name, email, password); 
                   
                    $container.innerHTML = ` 
                    <button id="addBooking-btn" class="btn">Añadir reserva</button>
                    <button id="updateBooking-btn" class="btn">Actualizar reserva</button>
                    <button id="addBooking-btn" class="btn">Eliminar reserva</button>
                     `;

                     bookingsManager.renderBookings();
                }else{
                    alert("credenciales de administrador no validas");
                }  
            })                   
        }

        
        });
    });