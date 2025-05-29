document.addEventListener('DOMContentLoaded', function () {
    const navbar = `
 <style>
  /* Navbar styling */
        .navbar {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 0.5rem 1rem;
        }

        .utility-nav {
            gap: 1.5rem;
        }

        .nav-link {
            color: #333;
            font-weight: 500;
            padding: 0.5rem 0.75rem;
            transition: all 0.2s;
        }

        .nav-link:hover {
            color: #0d6efd;
        }

        /* تنسيقات القائمة المنسدلة */
.ww-mega-menu {
  padding: 0;
  border: none;
  border-radius: 0;
  margin-top: 0;
}

.bg-dark-blue {
  background-color: #003366;
  color: white;
  padding: 20px 0;
}

/* تنسيقات العناصر الفردية */
.region-select {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  transition: background-color 0.2s;
}

.region-select:hover {
  background-color: rgba(255,255,255,0.1);
}

.region-flag {
  width: 30px;
  height: 20px;
  margin-right: 15px;
  flex-shrink: 0;
}

.region-global {
  width: 30px;
  height: 30px;
}

.region-details {
  flex-grow: 1;
}

.region {
  font-weight: 600;
  margin-bottom: 2px;
}

.region-lang {
  font-size: 0.85rem;
  opacity: 0.8;
}

.region-link {
  color: white;
  text-decoration: none;
}

.region-link:hover {
  text-decoration: none;
}

.region-group-title {
  color: #fff;
  margin: 15px 0 10px 10px;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding-bottom: 5px;
}

.global-site {
  background-color: rgba(255,255,255,0.1);
  border-radius: 4px;
  margin-top: 20px;
}

/* تجعل القائمة متجاوبة */
@media (max-width: 576px) {
  .region-select {
      padding: 8px 10px;
  }
  
  .region-flag {
      width: 25px;
      margin-right: 10px;
  }
}
        

 </style>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <!-- Utility Navigation -->
            <div class="utility-nav-wrap ms-auto">
                <ul class="utility-nav d-flex align-items-center mb-0 list-unstyled">
                    <li class="nav-item"><a class="nav-link" href="/responsibility.html">Responsibility</a></li>
                    <li class="nav-item"><a class="nav-link" href="/investors.html">Investors</a></li>
                    <li class="nav-item"><a class="nav-link" href="/media.html">Media</a></li>
                    <li class="nav-item"><a class="nav-link" href="/careers.html">Careers</a></li>

        
                </ul>
            </div>
        </div>
    </nav>







  `;
    document.body.insertAdjacentHTML('afterbegin', navbar);
});
