<template>
  <div class="container">
    <div class="container-header">
      <h2 @click="test">Goal Setting</h2>
    </div>
    <div class="container-body">
      <div class="header">
        <ul class="tab-list">
          <li
            class="tab-list-item"
            :class="{'is-active': branch.active}"
            v-for="branch in tree"
            :key="branch.id"
            @click="toggleTab(branch)">
            {{branch.name}}
          </li>
        </ul>
        <div class="select-wrapper">
          <select v-model="collegeRow" @change="toggleCollege">
            <option
              class="college-option"
              v-for="(op, index) in collegeOptions"
              :key="op.row"
              :selected="index === 0"
              :value="op.row">{{op.name}}</option>
          </select>
        </div>
      </div>
      <div class="wrapper-box" style="margin: 3px 5px;">
        <div class="branch-node header">
          <div class="branch-node-input">Target</div>
          <div class="branch-node-label" :title="currentBranch.name">{{currentBranch.name}}</div>
        </div>
      </div>
      <hr style="background-color: #ccc;height: 1px;border: none;"/>
      <div class="tab-content">
        <div class="wrapper-box" v-for="branch in currentBranch.children" :key="branch.id">
          <div class="branch-node">
            <div class="branch-node-input"></div>
            <div class="branch-node-label" :title="branch.name">{{branch.name}}</div>
          </div>
          <div class="leaf-node" v-for="leaf in branch.children">
            <div class="leaf-node-input">
              <input
                class="line-input"
                type="text"
                v-model="leaf.target"
                :disabled="leaf.target === null"
                :class="{'cursor-forbid': leaf.target === null}"/></div>
            <div class="leaf-node-label" :title="leaf.name">{{leaf.name}}</div>
          </div>
        </div>
      </div>
      <hr style="background-color: #ccc;height: 1px;border: none;"/>
      <div class="tab-footer">
        <button class="btn-confirm" @click="save">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Setting',
    data () {
      return {
        all: [],
        tree: [
          {
            'id': 0,
            'level': 1,
            'name': 'Student',
            'parent': 0,
            'children': [
              {
                'id': 6,
                'level': 2,
                'name': 'Student Size',
                'parent': 0,
                'children': [
                  {
                    'id': 29,
                    'level': 3,
                    'name': 'Total Number of Students',
                    'parent': 6,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 30,
                    'level': 3,
                    'name': 'Number of Undergraduate Students',
                    'parent': 6,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 31,
                    'level': 3,
                    'name': 'Number of Master’s Students',
                    'parent': 6,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 32,
                    'level': 3,
                    'name': 'Number of Doctoral Students',
                    'parent': 6,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 7,
                'level': 2,
                'name': 'Student Structure',
                'parent': 0,
                'children': [
                  {
                    'id': 33,
                    'level': 3,
                    'name': 'Percentage of Graduate Students',
                    'parent': 7,
                    'data': 0,
                    'target': null
                  }
                ]
              }
            ]
          },
          {
            'id': 1,
            'level': 1,
            'name': 'Faculty',
            'parent': 0,
            'children': [
              {
                'id': 8,
                'level': 2,
                'name': 'Faculty Size',
                'parent': 1,
                'children': [
                  {
                    'id': 34,
                    'level': 3,
                    'name': 'Total Number of Academic Staff',
                    'parent': 8,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 35,
                    'level': 3,
                    'name': 'Ratio of Academic Staff to Students',
                    'parent': 8,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 9,
                'level': 2,
                'name': 'Faculty Structure',
                'parent': 1,
                'children': [
                  {
                    'id': 36,
                    'level': 3,
                    'name': 'Percentage of Professors',
                    'parent': 9,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 37,
                    'level': 3,
                    'name': 'Percentage of Associate Professors',
                    'parent': 9,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 38,
                    'level': 3,
                    'name': 'Percentage of Assistant Professors',
                    'parent': 9,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 10,
                'level': 2,
                'name': 'Educational Background',
                'parent': 1,
                'children': [
                  {
                    'id': 39,
                    'level': 3,
                    'name': 'Number of Academic Staff with a Doctoral Degree',
                    'parent': 10,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 40,
                    'level': 3,
                    'name': 'Percentage of Academic Teaching Staff with a Doctoral Degree',
                    'parent': 10,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 41,
                    'level': 3,
                    'name': 'Percentage of Academic Research Staff with a Doctoral Degree',
                    'parent': 10,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 42,
                    'level': 3,
                    'name': 'Percentage of Academic Staff with a Doctoral Degree from ARWU Top 100 Universities',
                    'parent': 10,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 43,
                    'level': 3,
                    'name': 'Percentage of Academic Staff with a Doctoral Degree from ARWU Top 20 Universities',
                    'parent': 10,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 11,
                'level': 2,
                'name': 'Top Talents',
                'parent': 1,
                'children': [
                  {
                    'id': 44,
                    'level': 3,
                    'name': 'Number of Full-Time Staff winning Significant Academic Awards',
                    'parent': 11,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 45,
                    'level': 3,
                    'name': 'Editional Board Members in Top Journals of an Academic Subject',
                    'parent': 11,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 46,
                    'level': 3,
                    'name': 'Speakers in Top-Tier International Conference',
                    'parent': 11,
                    'data': 0,
                    'target': null
                  }
                ]
              }
            ]
          },
          {
            'id': 2,
            'level': 1,
            'name': 'Teaching',
            'parent': 0,
            'children': [
              {
                'id': 12,
                'level': 2,
                'name': 'Quality of Teaching',
                'parent': 2,
                'children': [
                  {
                    'id': 47,
                    'level': 3,
                    'name': 'Academic-Staff-to-Student Ratio',
                    'parent': 12,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 48,
                    'level': 3,
                    'name': 'Number of Undergraduate Courses offered',
                    'parent': 12,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 49,
                    'level': 3,
                    'name': 'Number of Graduate Courses offered',
                    'parent': 12,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 13,
                'level': 2,
                'name': 'Learning Outcomes',
                'parent': 2,
                'children': [
                  {
                    'id': 50,
                    'level': 3,
                    'name': 'Bachelors\' Graduation Rate',
                    'parent': 13,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 51,
                    'level': 3,
                    'name': 'Master\'s Graduation Rate',
                    'parent': 13,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 52,
                    'level': 3,
                    'name': 'Number of Doctoral Degree awarded',
                    'parent': 13,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 14,
                'level': 2,
                'name': 'Labour Market Outcomes',
                'parent': 2,
                'children': [
                  {
                    'id': 53,
                    'level': 3,
                    'name': 'Employment Rate of Bachelor Degree Recipients',
                    'parent': 14,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 54,
                    'level': 3,
                    'name': 'Employment Rate of Master’s Degree Recipients',
                    'parent': 14,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 55,
                    'level': 3,
                    'name': 'Employment Rate of Doctoral Degree Recipients',
                    'parent': 14,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 15,
                'level': 2,
                'name': 'Distinguished Alumni',
                'parent': 2,
                'children': [
                  {
                    'id': 56,
                    'level': 3,
                    'name': 'Number of Alumni winning Significant Academic Awards',
                    'parent': 15,
                    'data': 0,
                    'target': null
                  }
                ]
              }
            ]
          },
          {
            'id': 3,
            'level': 1,
            'name': 'Research',
            'parent': 0,
            'children': [
              {
                'id': 16,
                'level': 2,
                'name': 'Research Output',
                'parent': 3,
                'children': [
                  {
                    'id': 57,
                    'level': 3,
                    'name': 'Number of Papers indexed in Scopus',
                    'parent': 16,
                    'data': 910,
                    'target': 1000
                  },
                  {
                    'id': 58,
                    'level': 3,
                    'name': 'Number of Papers indexed in Web of Science',
                    'parent': 16,
                    'data': 660,
                    'target': 700
                  },
                  {
                    'id': 59,
                    'level': 3,
                    'name': 'Books',
                    'parent': 16,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 60,
                    'level': 3,
                    'name': 'Conferences',
                    'parent': 16,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 17,
                'level': 2,
                'name': 'Research Productivity',
                'parent': 3,
                'children': [
                  {
                    'id': 61,
                    'level': 3,
                    'name': 'Scopus Papers per Academic Staff',
                    'parent': 17,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 62,
                    'level': 3,
                    'name': 'Web of Science Papers per Academic Staff',
                    'parent': 17,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 18,
                'level': 2,
                'name': 'Research Influence',
                'parent': 3,
                'children': [
                  {
                    'id': 63,
                    'level': 3,
                    'name': 'Number of Citations (Self-Citation Included)',
                    'parent': 18,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 64,
                    'level': 3,
                    'name': 'Citations per Paper (Self-Citation Included)',
                    'parent': 18,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 65,
                    'level': 3,
                    'name': 'CNCI',
                    'parent': 18,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 66,
                    'level': 3,
                    'name': 'H-Index',
                    'parent': 18,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 19,
                'level': 2,
                'name': 'Top Research Outcomes',
                'parent': 3,
                'children': [
                  {
                    'id': 67,
                    'level': 3,
                    'name': 'Number of Papers Published in Top Journals',
                    'parent': 19,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 68,
                    'level': 3,
                    'name': 'Number of Highly Cited Papers indexed in Scopus (Top 1% Most Cited)',
                    'parent': 19,
                    'data': 97,
                    'target': 100
                  },
                  {
                    'id': 69,
                    'level': 3,
                    'name': 'Number of Highly Cited Papers indexed in Web of Science (Top 1% Most Cited)',
                    'parent': 19,
                    'data': 60,
                    'target': 50
                  },
                  {
                    'id': 70,
                    'level': 3,
                    'name': 'Number of Highly Cited Papers indexed in Scopus (Top 10% Most Cited)',
                    'parent': 19,
                    'data': 299,
                    'target': 350
                  },
                  {
                    'id': 71,
                    'level': 3,
                    'name': 'Number of Highly Cited Papers indexed in Web of Science (Top 10% Most Cited)',
                    'parent': 19,
                    'data': 208,
                    'target': 200
                  }
                ]
              },
              {
                'id': 20,
                'level': 2,
                'name': 'Research Income',
                'parent': 3,
                'children': [
                  {
                    'id': 72,
                    'level': 3,
                    'name': 'Total Amount of Research Income',
                    'parent': 20,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 73,
                    'level': 3,
                    'name': 'Research Income per Academic Staff',
                    'parent': 20,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 74,
                    'level': 3,
                    'name': 'Research Income from Public Sectors',
                    'parent': 20,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 75,
                    'level': 3,
                    'name': 'Research Income from Industry',
                    'parent': 20,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 76,
                    'level': 3,
                    'name': 'Percentage of Research Income from Public Sectors',
                    'parent': 20,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 21,
                'level': 2,
                'name': 'Knowledge Transfer',
                'parent': 3,
                'children': [
                  {
                    'id': 77,
                    'level': 3,
                    'name': 'Co-Publications with Industrial Partners',
                    'parent': 21,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 78,
                    'level': 3,
                    'name': 'Patents awarded',
                    'parent': 21,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 79,
                    'level': 3,
                    'name': 'Patents awarded per Academic Staff',
                    'parent': 21,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 80,
                    'level': 3,
                    'name': 'Industry Co-Patents',
                    'parent': 21,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 81,
                    'level': 3,
                    'name': 'Spin-offs',
                    'parent': 21,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 82,
                    'level': 3,
                    'name': 'Publications cited in Patents',
                    'parent': 21,
                    'data': 0,
                    'target': null
                  }
                ]
              }
            ]
          },
          {
            'id': 4,
            'level': 1,
            'name': 'Internationalisation',
            'parent': 0,
            'children': [
              {
                'id': 22,
                'level': 2,
                'name': 'Faculty',
                'parent': 4,
                'children': [
                  {
                    'id': 83,
                    'level': 3,
                    'name': 'Percentage of International Academic Teaching Staff',
                    'parent': 22,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 84,
                    'level': 3,
                    'name': 'Percentage of International Academic Research Staff',
                    'parent': 22,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 23,
                'level': 2,
                'name': 'Student',
                'parent': 4,
                'children': [
                  {
                    'id': 85,
                    'level': 3,
                    'name': 'Percentage of International Students',
                    'parent': 23,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 86,
                    'level': 3,
                    'name': 'Percentage of International Undergraduate Students',
                    'parent': 23,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 87,
                    'level': 3,
                    'name': 'Percentage of International Master’s Students',
                    'parent': 23,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 88,
                    'level': 3,
                    'name': 'Percentage of International Doctoral Students',
                    'parent': 23,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 24,
                'level': 2,
                'name': 'Research',
                'parent': 4,
                'children': [
                  {
                    'id': 89,
                    'level': 3,
                    'name': 'Number of Internationally Collaborated Papers indexed in Scopus ',
                    'parent': 24,
                    'data': 829,
                    'target': 800
                  },
                  {
                    'id': 90,
                    'level': 3,
                    'name': 'Number of Internationally Collaborated Papers indexed in Web of Science',
                    'parent': 24,
                    'data': 585,
                    'target': 600
                  },
                  {
                    'id': 91,
                    'level': 3,
                    'name': 'Percentage of Internationally Collaborated Papers',
                    'parent': 24,
                    'data': 0,
                    'target': null
                  }
                ]
              }
            ]
          },
          {
            'id': 5,
            'level': 1,
            'name': 'Ranking',
            'parent': 0,
            'children': [
              {
                'id': 25,
                'level': 2,
                'name': 'ARWU',
                'parent': 5,
                'children': [
                  {
                    'id': 92,
                    'level': 3,
                    'name': 'Number of Alumni winning Nobel Prizes and Fields Medals',
                    'parent': 25,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 93,
                    'level': 3,
                    'name': 'Number of Full-Time Staff winning Nobel Prizes and Fields Medals',
                    'parent': 25,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 94,
                    'level': 3,
                    'name': 'Clarivate Analytics Highly Cited Researchers',
                    'parent': 25,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 95,
                    'level': 3,
                    'name': 'Number of Papers published in Nature and Science ',
                    'parent': 25,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 96,
                    'level': 3,
                    'name': 'Number of Papers indexed in SCIE and SSCI',
                    'parent': 25,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 97,
                    'level': 3,
                    'name': 'Weighted Score of the Five ARWU Indicators divided by the Number of FTE Academic Staff',
                    'parent': 25,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 26,
                'level': 2,
                'name': 'THE',
                'parent': 5,
                'children': [
                  {
                    'id': 98,
                    'level': 3,
                    'name': 'Teaching Reputation Score',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 99,
                    'level': 3,
                    'name': 'Academic-Staff-to-Student Ratio',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 100,
                    'level': 3,
                    'name': 'Doctorate-to-Bachelor\'s Ratio',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 101,
                    'level': 3,
                    'name': 'Doctorates-awarded-to-Academic-Staff Ratio',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 102,
                    'level': 3,
                    'name': 'Institutional Income',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 103,
                    'level': 3,
                    'name': 'Research Reputation Score',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 104,
                    'level': 3,
                    'name': 'Research Income',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 105,
                    'level': 3,
                    'name': 'Research Productivity (Scopus Papers per Academic Staff)',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 106,
                    'level': 3,
                    'name': 'Citations (FWCI)',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 107,
                    'level': 3,
                    'name': 'International-to-Domestic-Student Ratio',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 108,
                    'level': 3,
                    'name': 'International-to-Domestic-Staff Ratio',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 109,
                    'level': 3,
                    'name': 'International Collaboration (Percentage of Internationally Collaborated Scopus Papers)',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 110,
                    'level': 3,
                    'name': 'Research Income from Industry',
                    'parent': 26,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 27,
                'level': 2,
                'name': 'QS',
                'parent': 5,
                'children': [
                  {
                    'id': 111,
                    'level': 3,
                    'name': 'Academic Reputation Score',
                    'parent': 27,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 112,
                    'level': 3,
                    'name': 'Employer Reputation Score',
                    'parent': 27,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 113,
                    'level': 3,
                    'name': 'Academic-Staff-to-Student Ratio',
                    'parent': 27,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 114,
                    'level': 3,
                    'name': 'Citations per Faculty (NTCC per Faculty)',
                    'parent': 27,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 115,
                    'level': 3,
                    'name': 'International Faculty Ratio',
                    'parent': 27,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 116,
                    'level': 3,
                    'name': 'International Student Ratio',
                    'parent': 27,
                    'data': 0,
                    'target': null
                  }
                ]
              },
              {
                'id': 28,
                'level': 2,
                'name': 'U.S. News',
                'parent': 5,
                'children': [
                  {
                    'id': 117,
                    'level': 3,
                    'name': 'Global Research Reputation (indicator ranking position #)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 118,
                    'level': 3,
                    'name': 'Regional Research Reputation (indicator ranking position #)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 119,
                    'level': 3,
                    'name': 'Publications (Number of Papers indexed in Web of Science, including reviews, articles and notes)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 120,
                    'level': 3,
                    'name': 'Books',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 121,
                    'level': 3,
                    'name': 'Conferences',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 122,
                    'level': 3,
                    'name': 'Normalized Citation Impact (CNCI)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 123,
                    'level': 3,
                    'name': 'Number of Citations',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 124,
                    'level': 3,
                    'name': 'Number of Highly Cited Papers (Top 10% Most Cited)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 125,
                    'level': 3,
                    'name': 'Percentage of Highly Cited Papers (Top 10% Most Cited)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 126,
                    'level': 3,
                    'name': 'International Collaboration (Percentage of Institution\'s Publications with International Collaboration divided by Percentage of Publications with International Collaboration for the Country that the Institution is in)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 127,
                    'level': 3,
                    'name': 'Percentage of Total Publications with International Collaboration',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 128,
                    'level': 3,
                    'name': 'Number of Highly Cited Papers (Top 1% Most Cited)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  },
                  {
                    'id': 129,
                    'level': 3,
                    'name': 'Percentage of Highly Cited Papers (Top 1% Most Cited)',
                    'parent': 28,
                    'data': 0,
                    'target': null
                  }
                ]
              }
            ]
          }
        ],
        college: [
          {
            'row': 2,
            'name': 'Department of Chemistry',
            'abridge': 'Dept Chem',
            'completion': 0.777915178571429,
            'researchData': [
              {
                'id': 57,
                'value': 821
              },
              {
                'id': 58,
                'value': 528
              },
              {
                'id': 68,
                'value': 755
              },
              {
                'id': 69,
                'value': 420
              },
              {
                'id': 70,
                'value': 374
              },
              {
                'id': 71,
                'value': 114
              },
              {
                'id': 89,
                'value': 102
              },
              {
                'id': 90,
                'value': 27
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 1000
              },
              {
                'id': 58,
                'value': 800
              },
              {
                'id': 68,
                'value': 800
              },
              {
                'id': 69,
                'value': 700
              },
              {
                'id': 70,
                'value': 350
              },
              {
                'id': 71,
                'value': 200
              },
              {
                'id': 89,
                'value': 100
              },
              {
                'id': 90,
                'value': 50
              }
            ]
          },
          {
            'row': 3,
            'name': 'Department of Mathematics',
            'abridge': 'Dept Math',
            'completion': 0.991049107142857,
            'researchData': [
              {
                'id': 57,
                'value': 910
              },
              {
                'id': 58,
                'value': 660
              },
              {
                'id': 68,
                'value': 829
              },
              {
                'id': 69,
                'value': 585
              },
              {
                'id': 70,
                'value': 299
              },
              {
                'id': 71,
                'value': 208
              },
              {
                'id': 89,
                'value': 97
              },
              {
                'id': 90,
                'value': 60
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 1000
              },
              {
                'id': 58,
                'value': 700
              },
              {
                'id': 68,
                'value': 800
              },
              {
                'id': 69,
                'value': 600
              },
              {
                'id': 70,
                'value': 350
              },
              {
                'id': 71,
                'value': 200
              },
              {
                'id': 89,
                'value': 100
              },
              {
                'id': 90,
                'value': 50
              }
            ]
          },
          {
            'row': 4,
            'name': 'Faculty of Engineering',
            'abridge': 'Fac Engn',
            'completion': 0.917535714285714,
            'researchData': [
              {
                'id': 57,
                'value': 946
              },
              {
                'id': 58,
                'value': 328
              },
              {
                'id': 68,
                'value': 806
              },
              {
                'id': 69,
                'value': 264
              },
              {
                'id': 70,
                'value': 326
              },
              {
                'id': 71,
                'value': 80
              },
              {
                'id': 89,
                'value': 79
              },
              {
                'id': 90,
                'value': 21
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 800
              },
              {
                'id': 58,
                'value': 600
              },
              {
                'id': 68,
                'value': 500
              },
              {
                'id': 69,
                'value': 350
              },
              {
                'id': 70,
                'value': 250
              },
              {
                'id': 71,
                'value': 150
              },
              {
                'id': 89,
                'value': 80
              },
              {
                'id': 90,
                'value': 50
              }
            ]
          },
          {
            'row': 5,
            'name': 'Department of Physics',
            'abridge': 'Dept Phys',
            'completion': 0.704816964285714,
            'researchData': [
              {
                'id': 57,
                'value': 575
              },
              {
                'id': 58,
                'value': 256
              },
              {
                'id': 68,
                'value': 541
              },
              {
                'id': 69,
                'value': 215
              },
              {
                'id': 70,
                'value': 259
              },
              {
                'id': 71,
                'value': 51
              },
              {
                'id': 89,
                'value': 79
              },
              {
                'id': 90,
                'value': 13
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 800
              },
              {
                'id': 58,
                'value': 600
              },
              {
                'id': 68,
                'value': 500
              },
              {
                'id': 69,
                'value': 350
              },
              {
                'id': 70,
                'value': 250
              },
              {
                'id': 71,
                'value': 150
              },
              {
                'id': 89,
                'value': 80
              },
              {
                'id': 90,
                'value': 30
              }
            ]
          },
          {
            'row': 6,
            'name': 'Faculty of Computing and Information Technology',
            'abridge': 'Fac Comp & Informat Technol',
            'completion': 0.344520833333333,
            'researchData': [
              {
                'id': 57,
                'value': 338
              },
              {
                'id': 58,
                'value': 78
              },
              {
                'id': 68,
                'value': 276
              },
              {
                'id': 69,
                'value': 71
              },
              {
                'id': 70,
                'value': 129
              },
              {
                'id': 71,
                'value': 17
              },
              {
                'id': 89,
                'value': 44
              },
              {
                'id': 90,
                'value': 2
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 600
              },
              {
                'id': 58,
                'value': 500
              },
              {
                'id': 68,
                'value': 450
              },
              {
                'id': 69,
                'value': 400
              },
              {
                'id': 70,
                'value': 250
              },
              {
                'id': 71,
                'value': 150
              },
              {
                'id': 89,
                'value': 80
              },
              {
                'id': 90,
                'value': 30
              }
            ]
          },
          {
            'row': 7,
            'name': 'Faculty of Environmental Designs',
            'abridge': 'Fac Environm Design',
            'completion': 0.282107142857143,
            'researchData': [
              {
                'id': 57,
                'value': 275
              },
              {
                'id': 58,
                'value': 61
              },
              {
                'id': 68,
                'value': 219
              },
              {
                'id': 69,
                'value': 50
              },
              {
                'id': 70,
                'value': 96
              },
              {
                'id': 71,
                'value': 7
              },
              {
                'id': 89,
                'value': 32
              },
              {
                'id': 90,
                'value': 1
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 500
              },
              {
                'id': 58,
                'value': 400
              },
              {
                'id': 68,
                'value': 400
              },
              {
                'id': 69,
                'value': 350
              },
              {
                'id': 70,
                'value': 250
              },
              {
                'id': 71,
                'value': 150
              },
              {
                'id': 89,
                'value': 80
              },
              {
                'id': 90,
                'value': 30
              }
            ]
          },
          {
            'row': 8,
            'name': 'Faculty of Meteorology, Environment and Arid Land Agriculture',
            'abridge': 'Fac Meteorol Environm & Arid Land Agr',
            'completion': 0.495833333333333,
            'researchData': [
              {
                'id': 57,
                'value': 322
              },
              {
                'id': 58,
                'value': 63
              },
              {
                'id': 68,
                'value': 275
              },
              {
                'id': 69,
                'value': 38
              },
              {
                'id': 70,
                'value': 86
              },
              {
                'id': 71,
                'value': 6
              },
              {
                'id': 89,
                'value': 15
              },
              {
                'id': 90,
                'value': 1
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 300
              },
              {
                'id': 58,
                'value': 300
              },
              {
                'id': 68,
                'value': 250
              },
              {
                'id': 69,
                'value': 150
              },
              {
                'id': 70,
                'value': 100
              },
              {
                'id': 71,
                'value': 50
              },
              {
                'id': 89,
                'value': 50
              },
              {
                'id': 90,
                'value': 20
              }
            ]
          },
          {
            'row': 9,
            'name': 'Faculty of Medicine',
            'abridge': 'Fac Med',
            'completion': 0.503666666666667,
            'researchData': [
              {
                'id': 57,
                'value': 181
              },
              {
                'id': 58,
                'value': 216
              },
              {
                'id': 68,
                'value': 144
              },
              {
                'id': 69,
                'value': 135
              },
              {
                'id': 70,
                'value': 40
              },
              {
                'id': 71,
                'value': 12
              },
              {
                'id': 89,
                'value': 9
              },
              {
                'id': 90,
                'value': 1
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 300
              },
              {
                'id': 58,
                'value': 200
              },
              {
                'id': 68,
                'value': 250
              },
              {
                'id': 69,
                'value': 150
              },
              {
                'id': 70,
                'value': 100
              },
              {
                'id': 71,
                'value': 50
              },
              {
                'id': 89,
                'value': 50
              },
              {
                'id': 90,
                'value': 20
              }
            ]
          },
          {
            'row': 10,
            'name': 'Faculty of Pharmacy',
            'abridge': 'Fac Pharm',
            'completion': 0.522083333333333,
            'researchData': [
              {
                'id': 57,
                'value': 283
              },
              {
                'id': 58,
                'value': 110
              },
              {
                'id': 68,
                'value': 255
              },
              {
                'id': 69,
                'value': 101
              },
              {
                'id': 70,
                'value': 69
              },
              {
                'id': 71,
                'value': 5
              },
              {
                'id': 89,
                'value': 10
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 300
              },
              {
                'id': 58,
                'value': 200
              },
              {
                'id': 68,
                'value': 250
              },
              {
                'id': 69,
                'value': 150
              },
              {
                'id': 70,
                'value': 100
              },
              {
                'id': 71,
                'value': 50
              },
              {
                'id': 89,
                'value': 50
              },
              {
                'id': 90,
                'value': 20
              }
            ]
          },
          {
            'row': 11,
            'name': 'Faculty of Earth Sciences',
            'abridge': 'Fac Earth Sci',
            'completion': 0.426666666666667,
            'researchData': [
              {
                'id': 57,
                'value': 186
              },
              {
                'id': 58,
                'value': 28
              },
              {
                'id': 68,
                'value': 139
              },
              {
                'id': 69,
                'value': 22
              },
              {
                'id': 70,
                'value': 40
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 7
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 200
              },
              {
                'id': 58,
                'value': 150
              },
              {
                'id': 68,
                'value': 150
              },
              {
                'id': 69,
                'value': 100
              },
              {
                'id': 70,
                'value': 50
              },
              {
                'id': 71,
                'value': 40
              },
              {
                'id': 89,
                'value': 20
              },
              {
                'id': 90,
                'value': 15
              }
            ]
          },
          {
            'row': 12,
            'name': 'Faculty of Marine Sciences',
            'abridge': 'Fac Marine Sc',
            'completion': 0.197916666666667,
            'researchData': [
              {
                'id': 57,
                'value': 60
              },
              {
                'id': 58,
                'value': 43
              },
              {
                'id': 68,
                'value': 45
              },
              {
                'id': 69,
                'value': 32
              },
              {
                'id': 70,
                'value': 8
              },
              {
                'id': 71,
                'value': 2
              },
              {
                'id': 89,
                'value': 2
              },
              {
                'id': 90,
                'value': 1
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 200
              },
              {
                'id': 58,
                'value': 150
              },
              {
                'id': 68,
                'value': 150
              },
              {
                'id': 69,
                'value': 100
              },
              {
                'id': 70,
                'value': 50
              },
              {
                'id': 71,
                'value': 40
              },
              {
                'id': 89,
                'value': 20
              },
              {
                'id': 90,
                'value': 15
              }
            ]
          },
          {
            'row': 13,
            'name': 'Faculty of Applied Medical Sciences',
            'abridge': 'Fac Appl Med Sci',
            'completion': 0.403020833333333,
            'researchData': [
              {
                'id': 57,
                'value': 67
              },
              {
                'id': 58,
                'value': 62
              },
              {
                'id': 68,
                'value': 49
              },
              {
                'id': 69,
                'value': 43
              },
              {
                'id': 70,
                'value': 10
              },
              {
                'id': 71,
                'value': 3
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 1
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 100
              },
              {
                'id': 58,
                'value': 80
              },
              {
                'id': 68,
                'value': 80
              },
              {
                'id': 69,
                'value': 60
              },
              {
                'id': 70,
                'value': 40
              },
              {
                'id': 71,
                'value': 40
              },
              {
                'id': 89,
                'value': 10
              },
              {
                'id': 90,
                'value': 8
              }
            ]
          },
          {
            'row': 14,
            'name': 'Faculty of Dentistry',
            'abridge': 'Fac Dent',
            'completion': 0.333854166666667,
            'researchData': [
              {
                'id': 57,
                'value': 50
              },
              {
                'id': 58,
                'value': 61
              },
              {
                'id': 68,
                'value': 38
              },
              {
                'id': 69,
                'value': 53
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 100
              },
              {
                'id': 58,
                'value': 80
              },
              {
                'id': 68,
                'value': 80
              },
              {
                'id': 69,
                'value': 60
              },
              {
                'id': 70,
                'value': 40
              },
              {
                'id': 71,
                'value': 40
              },
              {
                'id': 89,
                'value': 10
              },
              {
                'id': 90,
                'value': 8
              }
            ]
          },
          {
            'row': 15,
            'name': 'Faculty of Art & Humanities',
            'abridge': 'Fac Arts & Humanities',
            'completion': 0.241354166666667,
            'researchData': [
              {
                'id': 57,
                'value': 41
              },
              {
                'id': 58,
                'value': 22
              },
              {
                'id': 68,
                'value': 29
              },
              {
                'id': 69,
                'value': 17
              },
              {
                'id': 70,
                'value': 8
              },
              {
                'id': 71,
                'value': 4
              },
              {
                'id': 89,
                'value': 3
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 100
              },
              {
                'id': 58,
                'value': 80
              },
              {
                'id': 68,
                'value': 80
              },
              {
                'id': 69,
                'value': 60
              },
              {
                'id': 70,
                'value': 40
              },
              {
                'id': 71,
                'value': 40
              },
              {
                'id': 89,
                'value': 10
              },
              {
                'id': 90,
                'value': 8
              }
            ]
          },
          {
            'row': 16,
            'name': 'Faculty of Nursing',
            'abridge': 'Fac Nursing',
            'completion': 0.37625,
            'researchData': [
              {
                'id': 57,
                'value': 42
              },
              {
                'id': 58,
                'value': 1
              },
              {
                'id': 68,
                'value': 41
              },
              {
                'id': 69,
                'value': 1
              },
              {
                'id': 70,
                'value': 11
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 50
              },
              {
                'id': 58,
                'value': 50
              },
              {
                'id': 68,
                'value': 40
              },
              {
                'id': 69,
                'value': 40
              },
              {
                'id': 70,
                'value': 10
              },
              {
                'id': 71,
                'value': 10
              },
              {
                'id': 89,
                'value': 5
              },
              {
                'id': 90,
                'value': 5
              }
            ]
          },
          {
            'row': 17,
            'name': 'Faculty of Economics and Administration',
            'abridge': 'Fac Econ & Adm',
            'completion': 0.36875,
            'researchData': [
              {
                'id': 57,
                'value': 26
              },
              {
                'id': 58,
                'value': 24
              },
              {
                'id': 68,
                'value': 22
              },
              {
                'id': 69,
                'value': 20
              },
              {
                'id': 70,
                'value': 7
              },
              {
                'id': 71,
                'value': 2
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 50
              },
              {
                'id': 58,
                'value': 50
              },
              {
                'id': 68,
                'value': 40
              },
              {
                'id': 69,
                'value': 40
              },
              {
                'id': 70,
                'value': 10
              },
              {
                'id': 71,
                'value': 10
              },
              {
                'id': 89,
                'value': 5
              },
              {
                'id': 90,
                'value': 5
              }
            ]
          },
          {
            'row': 18,
            'name': 'Jeddah Community Collage',
            'abridge': 'Jeddah Community Coll',
            'completion': 0.10125,
            'researchData': [
              {
                'id': 57,
                'value': 10
              },
              {
                'id': 58,
                'value': 8
              },
              {
                'id': 68,
                'value': 10
              },
              {
                'id': 69,
                'value': 8
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 50
              },
              {
                'id': 58,
                'value': 50
              },
              {
                'id': 68,
                'value': 40
              },
              {
                'id': 69,
                'value': 40
              },
              {
                'id': 70,
                'value': 10
              },
              {
                'id': 71,
                'value': 10
              },
              {
                'id': 89,
                'value': 5
              },
              {
                'id': 90,
                'value': 5
              }
            ]
          },
          {
            'row': 19,
            'name': 'Faculty of Law',
            'abridge': 'Fac Law',
            'completion': 0.2625,
            'researchData': [
              {
                'id': 57,
                'value': 11
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 8
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 10
              },
              {
                'id': 58,
                'value': 10
              },
              {
                'id': 68,
                'value': 8
              },
              {
                'id': 69,
                'value': 8
              },
              {
                'id': 70,
                'value': 5
              },
              {
                'id': 71,
                'value': 5
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 20,
            'name': 'Faculty of Maritime Studies',
            'abridge': 'Fac Maritime Studies',
            'completion': 0.30625,
            'researchData': [
              {
                'id': 57,
                'value': 6
              },
              {
                'id': 58,
                'value': 9
              },
              {
                'id': 68,
                'value': 2
              },
              {
                'id': 69,
                'value': 4
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 10
              },
              {
                'id': 58,
                'value': 10
              },
              {
                'id': 68,
                'value': 8
              },
              {
                'id': 69,
                'value': 8
              },
              {
                'id': 70,
                'value': 5
              },
              {
                'id': 71,
                'value': 5
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 21,
            'name': 'Faculty of Communication and Media',
            'abridge': 'Fac Communication & Media',
            'completion': 0.06875,
            'researchData': [
              {
                'id': 57,
                'value': 3
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 2
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 10
              },
              {
                'id': 58,
                'value': 10
              },
              {
                'id': 68,
                'value': 8
              },
              {
                'id': 69,
                'value': 8
              },
              {
                'id': 70,
                'value': 5
              },
              {
                'id': 71,
                'value': 5
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 22,
            'name': 'Faculty of Home Economics',
            'abridge': 'Home Econ',
            'completion': 0.41875,
            'researchData': [
              {
                'id': 57,
                'value': 5
              },
              {
                'id': 58,
                'value': 3
              },
              {
                'id': 68,
                'value': 4
              },
              {
                'id': 69,
                'value': 3
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 5
              },
              {
                'id': 58,
                'value': 5
              },
              {
                'id': 68,
                'value': 4
              },
              {
                'id': 69,
                'value': 4
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 23,
            'name': 'Islamic Economics Institute',
            'abridge': 'Islamic Econ Dept',
            'completion': 0.13125,
            'researchData': [
              {
                'id': 57,
                'value': 4
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 1
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 5
              },
              {
                'id': 58,
                'value': 5
              },
              {
                'id': 68,
                'value': 4
              },
              {
                'id': 69,
                'value': 4
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 24,
            'name': 'English Language Institute',
            'abridge': 'English Language Inst',
            'completion': 0.10625,
            'researchData': [
              {
                'id': 57,
                'value': 3
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 1
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 5
              },
              {
                'id': 58,
                'value': 5
              },
              {
                'id': 68,
                'value': 4
              },
              {
                'id': 69,
                'value': 4
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 25,
            'name': 'Faculty Tourism',
            'abridge': 'Fac Tourism',
            'completion': 0,
            'researchData': [
              {
                'id': 57,
                'value': 0
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 0
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 1
              },
              {
                'id': 58,
                'value': 1
              },
              {
                'id': 68,
                'value': 1
              },
              {
                'id': 69,
                'value': 1
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 26,
            'name': 'Institute of Educational Graduate Studies',
            'abridge': 'Educ Grad Studies',
            'completion': 0.125,
            'researchData': [
              {
                'id': 57,
                'value': 1
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 0
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 1
              },
              {
                'id': 58,
                'value': 1
              },
              {
                'id': 68,
                'value': 1
              },
              {
                'id': 69,
                'value': 1
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          },
          {
            'row': 27,
            'name': 'The Arabic Language Institute for Speakers of Other Languages',
            'abridge': 'Arabic Language Inst',
            'completion': 0,
            'researchData': [
              {
                'id': 57,
                'value': 0
              },
              {
                'id': 58,
                'value': 0
              },
              {
                'id': 68,
                'value': 0
              },
              {
                'id': 69,
                'value': 0
              },
              {
                'id': 70,
                'value': 0
              },
              {
                'id': 71,
                'value': 0
              },
              {
                'id': 89,
                'value': 0
              },
              {
                'id': 90,
                'value': 0
              }
            ],
            'researchTarget': [
              {
                'id': 57,
                'value': 1
              },
              {
                'id': 58,
                'value': 1
              },
              {
                'id': 68,
                'value': 1
              },
              {
                'id': 69,
                'value': 1
              },
              {
                'id': 70,
                'value': 1
              },
              {
                'id': 71,
                'value': 1
              },
              {
                'id': 89,
                'value': 1
              },
              {
                'id': 90,
                'value': 1
              }
            ]
          }
        ],
        ids: [57, 58, 68, 69, 70, 71, 89, 90],
        collegeRow: 2,
        currentBranch: {}
      }
    },
    mounted () {
      this.$nextTick(function () {
        let localTree = window.localStorage.getItem('collegeGoalMap')
        if (localTree) {
          this.college = JSON.parse(localTree)
        }
        this.collegeRow = this.collegeOptions[0].row
        this.toggleCollege()
        this.currentBranch = this.tree[0]
      })
    },
    computed: {
      collegeOptions () {
        return this.college.map(item => {
          return {
            row: item.row,
            name: item.name
          }
        })
      }
    },
    methods: {
      toggleTab (branch) {
        for (let item of this.tree) {
          item.active = item.id === branch.id
        }
        this.currentBranch = branch
      },
      toggleCollege () {
        const setData = function (tree, {id, data, target}) {
          for (let level1 of tree) {
            for (let level2 of level1.children) {
              for (let level3 of level2.children) {
                if (level3.id === id) {
                  level3.data = data
                  level3.target = target
                  return
                }
              }
            }
          }
        }
        let coll = this.college.find(item => item.row === this.collegeRow)
        let researchData = coll.researchData
        let researchTarget = coll.researchTarget
        researchData.forEach((item, index) => {
          setData(this.tree, {
            id: item.id,
            data: item.value,
            target: researchTarget[index].value
          })
        })
        this.currentBranch = this.tree[0]
        this.tree.forEach((item, index) => {
          item.active = index === 0
        })
      },
      async () {
        const flatten = function (array) {
          return array.reduce((sum, value) => {
            return sum.concat(value.children ? flatten(value.children) : value)
          }, [])
        }
        let coll = this.college.find(item => item.row === this.collegeRow)
        flatten(this.tree).forEach(item => {
          coll.researchTarget.forEach(data => {
            if (item.id === data.id) {
              data.value = Number(item.target)
            }
          })
        })
      },
      save () {
        this.async()
        window.localStorage.setItem('collegeGoalMap', JSON.stringify(this.college))
        this.$notify({
          message: 'Save successfully.',
          type: 'success'
        })
      },
      test () {
        console.log(this.collegeRow)
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 15px;
    height: calc(100% - 30px);
    cursor: default;
    user-select: none;
  }
  .container-header,
  .container-body{
    padding: 15px;
    background-color: #fff;
  }
  .container-header>h2 {
    height: 40px;
    line-height: 40px;
    color: #32373d;
  }
  .container-body {
    height: calc(100% - 100px);
    overflow: hidden;
  }
  .tab-list {
    display: inline-block;
    margin: 0 5px;
    list-style: none;
    border: 1px solid #e4e7ed;
    border-radius: 5px;
  }
  .select-wrapper {
    float: right;
    display: inline-block;
    margin: 0 5px;
  }
  .select-wrapper select {
    outline: none;
    border: 1px solid #d5d5d5;
    padding: 8px 3px;
    border-radius: 3px;
    -webkit-transition: all 150ms linear;
    transition: all 150ms linear;
    color: #333;
  }
  .select-wrapper select:focus {
    border-color: #409eff;
  }
  .college-option {
    font-size: 12px;
  }
  .tab-list-item {
    padding: 4px 10px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    font-size: 12px;
    color: #909399;
    cursor: pointer;
  }
  .tab-list-item:hover {
    color: #1ebba6;
  }
  .tab-list-item.is-active {
    color: #1ebba6;
    background-color: #f5f7fa;
  }
  .wrapper-box {
    margin: 12px 5px;
    padding: 5px;
    border-radius: 5px;
    background-color: #f0f2f5;
  }
  .wrapper-box:nth-child(1) {
    margin-top: 4px;
  }
  .branch-node,
  .leaf-node {
    height: 30px;
    line-height: 30px;
  }
  .branch-node.header {
    font-size: 14px;
  }
  .tab-content {
    height: calc(100% - 130px);
    font-size: 12px;
    color: #30373d;
    overflow-y: scroll;
  }
  .branch-node-label,
  .leaf-node-label {
    white-space: nowrap;
    -ms-word-wrap: break-word;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .leaf-node-label {
    padding: 0 12px;
    text-indent: 20px;
  }
  .branch-node-input,
  .leaf-node-input {
    width: 45%;
    min-width: 400px;
    float: right;
  }
  .line-input {
    width: 120px;
    outline: none;
    border: 1px solid #d5d5d5;
    padding: 4px 3px;
    border-radius: 3px;
    transition: all 150ms linear;
    color: #a6a9ad;
  }
  .line-input:focus {
    color: #555;
    border-color: #409EFF;
  }
  .tab-footer {
    height: 40px;
    line-height: 40px;
    padding: 10px;
  }
  .line-input::placeholder {
    color: #ccc;
  }
  .btn-confirm {
    padding: 6px 12px;
    float: right;
    outline: none;
    border-radius: 5px;
    color: #fff;
    background-color: #5cb85c;
    border: 1px solid #4cae4c;
  }
  .btn-confirm:hover {
    background-color: #449d44;
    border-color: #398439;
  }
</style>
