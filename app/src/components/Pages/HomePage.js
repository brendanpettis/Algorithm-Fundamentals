import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import groupShot from '../../assets/group.jpg'
import antelope from '../../assets/antelope.jpg'
import bird from '../../assets/bird.jpg'
import cats from '../../assets/cats.jpg'
import deer from '../../assets/deer.jpg'
import duck from '../../assets/duck.jpg'
import goat from '../../assets/goat.jpg'
import leopard from '../../assets/leopard.jpg'
import lion from '../../assets/lion.jpg'
import pppy from '../../assets/pppy.jpg'
import rooster from '../../assets/rooster.jpg'
import wolf from '../../assets/wolf.jpg'
import sheep from '../../assets/sheep.jpg'

const HomePage = () => (
  <div>
      
      <Jumbotron>
        <h1>2019 Class Project</h1>
        <p>         
          Algorithms and Data Structures
        </p>
      <img class="groupshotnpm" alt="Class picture" src={groupShot} />
        <h2>Leaders</h2>
        <div class = "students"  class="aside">        
        <p>
          Brendan Pettis
        </p>
        <a class ="picture"> 
          <img class="headshot" alt="Brendan Pettis, Student" src={antelope} /> </a>
        </div>
      <div class="students" class="bside">
        <p>
          Nick Papadakis-Schneider
        </p>
        <a class="picture">
        <img class="headshot" alt="Nick Papadakis-Schneider, Student" src={bird} /> </a>
      </div>
      <h2>Creators</h2> 
      <div class="students" class="aside">
        <p>
          Nick Claudio
        </p>
        <a class="picture">
          <img class="headshot" alt="Nick Claudio, Student" src={cats} /> </a>
      </div>
      <div class="students" class="bside">
        <p>
          Natacia Taylor
        </p>
        <a class="picture">
          <img class="headshot" alt="Natacia Taylor, Student" src={duck} /> </a>
      </div>
      <div class="students" class="aside">
        <p>
          Diego Carrillo
        </p>
        <a class="picture">
          <img class="headshot" alt="Diego Carrillo, Student" src={deer} /> </a>
      </div>
      <div class="students" class="bside">
        <p>
          Nick Rutherford
        </p>
        <a>
          <img class="headshot" alt="Nick Rutherford, Student" src={goat} /> </a>
      </div>
      <div class="students" class="aside">
        <p>
          Aaron Farmer
        </p>
        <a>
          <img class="headshot" alt="Aaron Farmer, Student" src={leopard} /> </a>
      </div>
      <div class="students" class="bside">
        <p>
          AJ Graff
        </p>
        <a>
          <img class="headshot" alt="AJ Graff, Student" src={lion} /> </a>
      </div>
      <div class="students" class="aside">
        <p>
          Samuel Brooks
        </p>
        <a>
          <img class="headshot" alt="Samuel Brooks, Student" src={pppy} /> </a>
      </div>
      <div class="students" class="bside">
        <p>
          Laura Kaiser
        </p>
        <a>
          <img class="headshot" alt="Laura Kaiser, Student" src={rooster} /> </a>
      </div>
      <div class="students" class="aside">
        <p>
          Shaquille Wright
        </p>
        <a class ="picture">
          <img class="headshot" alt="Shaquille Wright, Student" src={wolf} /> </a>
      </div>
      <div class="students" class="bside">
        <p>
          
        </p>
      </div>
      <h2>Instructor</h2>
      <div class="students" class="aside">
        <p>
          Elijah Jones
        </p>
        <a>
          <img class="headshot" alt="Elijah Jones, Instructor" src={sheep} /> </a>
      </div>       
    </Jumbotron>
  </div>
);

export default HomePage;