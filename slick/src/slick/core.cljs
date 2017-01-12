(ns slick.core
  (:require [reagent.core :as r]))

;; -------------------------
;; State
(def all-beans (r/atom ["Pita" "Lima"]))

(defn discover-bean! [b]
  (swap! all-beans conj b))

(defn forget-bean! []
  (swap! all-beans butlast @all-beans))

;; -------------------------
;; Views
(defn bean-stats []
  [:p "Scientists currently estimate that there are " (count @all-beans) " beans in the world"])

(defn bean-list []
  [:ul
   (for [bean @all-beans]
     [:li bean])]) 

(def ENTER 13)
(defn bean-input []
  [:input {:on-key-press #(when (= ENTER (.-charCode %))
                            (discover-bean! (-> % .-target .-value)))}]) 

(defn snackbar []
  (let [classes (str "snackbar" (when (> (count @all-beans) 3) " slide-in"))]
    [:div {:class classes} 
     [:p {:class "message"}
      "Snackbar!"]
     [:p {:class "action" :on-click forget-bean!}
      "Forget"]]))

(defn home-page []
  [:div 
   [:h2 "Welcome to the Bean Life"]
   [:p [:strong "The #1 site for bean-related news"]]
   [bean-stats]
   [:p "Know of any other beans?"]
   [bean-input]
   [:p "All known beans:"]
   [bean-list]
   [snackbar]])

;; -------------------------
;; Initialize app

(defn mount-root []
  (r/render [home-page] (.getElementById js/document "app")))

(defn init! []
  (mount-root))

