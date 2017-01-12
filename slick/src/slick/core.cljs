(ns slick.core
  (:require [reagent.core :as r]))

;; -------------------------
;; State
(def all-beans (r/atom [1 2 3]))

(defn discover-bean! []
  (swap! all-beans conj (inc (last @all-beans))))

(defn forget-bean! []
  (swap! all-beans butlast @all-beans))

;; -------------------------
;; Views
(defn bean-stats []
  [:p "Scientists currently estimate that there are " (count @all-beans) " beans in the world"])

(defn inc-button []
  [:input {:type "button" :value "Discover New Bean"
           :on-click discover-bean!}])

(defn bean-list []
  [:ul
   (for [bean @all-beans]
     ^{:key bean} [:li "Bean " bean])]) 

(defn snackbar []
  (let [classes (str "snackbar" (when (> (count @all-beans) 3) " slide-in"))]
    [:div {:class classes} 
     [:p {:class "message"}
      "Allahu Snackbar!"]
     [:p {:class "action" :on-click forget-bean!}
      "Forget"]]))

(defn home-page []
  [:div 
   [:h2 "Welcome to Bean Life"]
   [:p [:strong "The #1 site for bean-related news"]]
   [bean-stats]
   [inc-button]
   [:p "Know of any other beans?"]
   [bean-list]
   [snackbar]])

;; -------------------------
;; Initialize app

(defn mount-root []
  (r/render [home-page] (.getElementById js/document "app")))

(defn init! []
  (mount-root))

