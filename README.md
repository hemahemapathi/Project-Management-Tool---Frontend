 #  PROJECT MANAGEMENT TOOL - FRONTEND
 
 
 1. OVERVIEW  :
    
       - The frontend of the Project Management Tool is crafted with React.js and Bootstrap to create a user-friendly, responsive interface.

       - It enables users to manage projects and  collaborate effectively within teams.

   
 3. ACCESS THE APPLICATION  :
    
       -  Open your browser and navigate to http://localhost:3000.

 4. LOGIN INSTRUCTIONS :

    Please follow the login instructions below based on your role in the system:

       For Managers :

        -  Use the format : yourname@manager.com


       Example: If your name is John, your email should be john@manager.com


       For Team Members :

        -  Use the format : yourname@example.com


       Example: If your name is Jane, your email should be jane@example.com


     Ensure you have the correct credentials before logging in       

  6. ROLE BASED ACCESS :

       Manager Access:

     -   Managers have full access to all features in the system.

     -   They can perform CRUD (Create, Read, Update, Delete) operations on all tasks and data.

     -   Managers are responsible for performing tasks that are not assigned to other users.

     -   Managers can also view and generate reports.

       Team Member Access:

     -   Team Members can only access tasks that have been assigned to them.

     -   They can view and update their own tasks but cannot create or delete tasks.

     -   Team Members can also view and generate reports, similar to Managers, but without broader administrative capabilities.

   
   This ensures clarity between login instructions and the different access levels for each role.
 
 
 5. KEY FEATURES  :
 
       User Authentication :
    
       -  Login/Registration: Users can securely register and log in, with proper validation messages for input errors.
    
       Task and Project Management :
    
       -  CRUD Operations: Create, read, update, and delete projects and tasks.
      
       -  Detailed View: View project details, including title, description, deadlines, and assigned team members.
         
      Interactive Dashboards :
    
       -  Visual Progress Tracking: Graphs and charts to visualize project status, deadlines, and task completion rates.
      
       -  Alerts and Notifications: Users receive alerts for approaching deadlines and task updates.
     
      Advanced Filtering and Sorting :
    
       -  Dynamic Filters: Users can filter tasks by categories, deadlines, priority levels, and status (e.g., completed, in-progress).
      
       -  Sorting Options: Sort tasks based on deadlines, priority, and other custom criteria.
     
      Responsive Design :

       -  Mobile Optimization: Utilizes Bootstrap for a responsive layout that works seamlessly on mobile devices and tablets.
      
       -  User-Centric Design: Focuses on a clean and intuitive UI for better user experience.
         
      State Management :
    
       -  Global State Management: Implements Redux or Context API to manage global state for user sessions and project data efficiently.
      
       -  Real-time Updates: Ensures UI reflects changes in data promptly, providing a seamless experience.
         
      Form Management :
    
       -  Formik Integration: Uses Formik for managing form state and validation, ensuring a robust and user-friendly experience for creating and editing tasks.
    
      Routing :
    
       -  React Router: Handles client-side routing to navigate between different views (e.g., dashboard, project details, user settings) without full page reloads.
    
      Documentation and Help :
    
       -  Inline Help and Tooltips: Provides users with contextual help and tooltips to guide them through various functionalities.



 6. CONTRIBUTION GUIDELINES  :

       -  We welcome contributions to the frontend! If you want to enhance the user interface or add new features:
     
       -  Fork the repository.
      
       -  Implement your changes.
      
       -  Submit a pull request with a detailed description of your enhancements.
          
 7. LICENSE  :

       -  This project is licensed under the MIT License. See the LICENSE file for more information.
   
 8. ACKNOWLEDMENT  :

       -  Thanks to the open-source community for their contributions and support in building this application.
   
         
