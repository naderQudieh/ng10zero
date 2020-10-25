import { Component } from '@angular/core';
import { animateChild, animation, stagger, useAnimation, sequence, state, AnimationTriggerMetadata, trigger, transition, query, style, animate, group } from '@angular/animations';
 
const left = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
        query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
            optional: true,
        }),
        query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
            optional: true,
        }),
    ]),
];

const right = [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
        query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
            optional: true,
        }),
        query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
            optional: true,
        }),
    ]),
];

export const myAnmaimations = [
  trigger('fadeOut', [
    state('void', style({ opacity: 0 })),
    transition(':leave', animate('1300ms ease-in'))
  ]),
  trigger('fadeIn', [
    state('void', style({ opacity: 0 })),
    transition('void => *', [
      style({ opacity: 0 }),
      animate('200ms ease-out', style({ opacity: 1 }))
    ])
  ]),
  trigger('slideToLeft', [
    transition('void => *', [
      style({ opacity: 0, transform: 'translateX(150%)' }),
      animate('200ms 100ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 },))
    ])
  ]),
  trigger('slideToRight', [
    transition('void => *', [
      style({ opacity: 0, transform: 'translateX(-150%)' }),
      animate('200ms 100ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 },))
    ])
  ]),
  trigger('slideToUpper', [
    transition('void => *', [
      style({ opacity: 0, transform: 'translateY(150%)' }),
      animate('300ms 100ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 },))
    ])
  ]),
  trigger('slideToDown', [
    transition('void => *', [
      style({ opacity: 0, transform: 'translateY(-150%)' }),
      animate('900ms 100ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 },))
    ])
  ])
]


export function slideToRight() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
    ])
  ]);
}

export function slideToLeft() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
    ])
  ]);
}

export function slideToBottom() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
    ])
  ]);
}

export function slideToTop() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
    ])
  ]);
}

export function slideToLeft2(): AnimationTriggerMetadata {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))])
  ]);
}


export const fuseAnimations = [
   

  trigger('animateStagger', [
    state('50', style('*')),
    state('100', style('*')),
    state('200', style('*')),

    transition('void => 50',
      query('@*',
        [
          stagger('50ms', [
            animateChild()
          ])
        ], { optional: true })),
    transition('void => 100',
      query('@*',
        [
          stagger('100ms', [
            animateChild()
          ])
        ], { optional: true })),
    transition('void => 200',
      query('@*',
        [
          stagger('200ms', [
            animateChild()
          ])
        ], { optional: true }))
  ]),

  trigger('fadeIn', [
    state('void', style({ opacity: 0 })),
    transition('void => *', [
      style({ opacity: 0 }),
      animate('200ms ease-out', style({ opacity: 1 }))
    ])
  ]),
  trigger('fadeInOut', [
    state('0', style({
      display: 'none',
      opacity: 0
    })),
    state('1', style({
      display: 'block',
      opacity: 1
    })),
    transition('1 => 0', animate('300ms ease-out')),
    transition('0 => 1', animate('300ms ease-in'))
  ]),

  trigger('slideInOut', [
    state('0', style({
      height: '0px',
      display: 'none'
    })),
    state('1', style({
      height: '*',
      display: 'block'
    })),
    transition('1 => 0', animate('300ms ease-out')),
    transition('0 => 1', animate('300ms ease-in'))
  ]),

  trigger('slideInLeft', [
    state('void', style({
      transform: 'translateX(-100%)',
      display: 'none'
    })),
    state('*', style({
      transform: 'translateX(0)',
      display: 'flex'
    })),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('slideInRight', [
    state('void', style({
      transform: 'translateX(100%)',
      display: 'none'
    })),
    state('*', style({
      transform: 'translateX(0)',
      display: 'flex'
    })),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('slideInTop', [
    state('void', style({
      transform: 'translateY(-100%)',
      display: 'none'
    })),
    state('*', style({
      transform: 'translateY(0)',
      display: 'flex'
    })),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ]),

  trigger('slideInBottom', [
    state('void',
      style({
        transform: 'translateY(100%)',
        display: 'none'
      })),
    state('*', style({
      transform: 'translateY(0)',
      display: 'flex'
    })),
    transition('void => *', animate('300ms')),
    transition('* => void', animate('300ms'))
  ])
]

export const fadeOut = trigger('fadeOut', [
  state('void', style({ opacity: 0 })),
  transition(':leave', animate('1300ms ease-in'))
]);

export const fadeInOut = trigger('fadeInOut', [
  state('void', style({ opacity: 0 })),
  transition(':enter', animate('300ms ease-in')),
  transition(':leave', animate('300ms ease-in'))
]);
export function fadeIn2(selector = ':enter', duration = '400ms ease-out') {
  return [
    transition('* => *', [
      query(selector, [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        stagger('60ms', [
          animate(duration, style({
            opacity: 1,
            transform: 'translateY(0px)'
          }))
        ])
      ], { optional: true })
    ])
  ];
}

export function fadeOut2(selector = ':leave', duration = 300) {
  return [
    transition('* => *', [
      query(selector, [
        style({ opacity: 1 }),
        stagger('30ms', [
          animate(duration, style({
            opacity: 0
          }))
        ])
      ], { optional: true })
    ])
  ];
}


export const myanimations = [
  trigger('fadeOut', [
    state('out', style({ opacity: 1 })),
    transition('* => void', [
      animate('300ms 100ms ease-out',
        style({ opacity: 0, height: 0 }),
      )
    ]),
  ]),
]
